import { Tokens, TokensList } from "marked";

export interface TokenListItem extends Tokens.ListItem {
  tokens: TokensList;
}

export interface TokenText extends Tokens.Text {
  tokens: TokensList;
}
