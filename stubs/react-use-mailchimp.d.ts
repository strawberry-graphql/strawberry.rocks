type Options = {
  url: string;
};

type MailchimpData = {
  result?: string;
};

type MailchimpState = {
  loading: boolean;
  error: string;
  data: MailchimpData;
};

type SubscribeOptions = {
  EMAIL: string;
};

declare module "react-use-mailchimp" {
  export function useMailchimp(
    options: Options
  ): [MailchimpState, (subscribe: SubscribeOptions) => void];
}
