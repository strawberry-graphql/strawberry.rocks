import jsonp from "jsonp";
import { useState } from "react";
import toQueryString from "to-querystring";

const getURL = (url: string) => url.replace("/post?", "/post-json?");

const isResponseIsError = (response: { result?: string }) =>
  response.result !== "success";

const getDefaultState = () => ({
  error: null,
  loading: false,
  data: null,
});

type State = {
  error: null | Error;
  loading: boolean;
  data: null | { result: string };
};

export const useMailchimp: (options: {
  url: string;
}) => [State, (data: { EMAIL: string }) => void, () => void] = ({
  url,
}: {
  url: string;
}) => {
  const [state, setState] = useState<State>(getDefaultState);

  const reset = () => {
    setState(getDefaultState());
  };

  const subscribe = (data: { EMAIL: string }) => {
    const params = toQueryString(data);
    const requestURL = getURL(url) + "&" + params;
    const requestOpts = {
      param: "c",
      timeout: 4000,
    };

    setState({
      loading: true,
      error: null,
      data: null,
    });

    const process = (error: any, response: any) => {
      if (error) {
        setState({
          loading: false,
          error,
          data: response,
        });
        return;
      }
      if (isResponseIsError(response)) {
        setState({
          loading: false,
          error: new Error(response.msg),
          data: response,
        });
        return;
      }
      setState({
        loading: false,
        error: null,
        data: response,
      });
    };

    jsonp(requestURL, requestOpts, process);
  };

  return [state, subscribe, reset];
};
