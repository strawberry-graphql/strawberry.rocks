import data from "../../../content/api/strawberry.json";
import { removeQuotes } from "./remove-quotes";

type Member = (typeof data.members)[0];

export const filterMembers = (members: Array<Member>) => {
  const all = (
    members.find((item: any) => item.name === "__all__")?.value?.elements || []
  ).map((item: any) => removeQuotes(item));

  return members.filter(
    (member: { name: string; kind: string }) =>
      all.includes(member.name) || member.kind === "module"
  ) as Member[];
};
