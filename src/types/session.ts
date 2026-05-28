export type NameMode = "given" | "alias" | "unnamed";

export type MatchPersonalization = {
  feeling?: string;
  role?: string;
  texture?: string;
  avoid?: string[];
  familiarity?: string;
  freeText?: Partial<Record<"feeling" | "role" | "texture" | "avoid" | "familiarity", string>>;
};

export type CreatePersonalization = {
  companionName?: string;
  feelings?: string[];
  role?: string;
  voice?: string;
  looks?: string[];
  boundaries?: string;
  context?: string;
};

export type BrowsePersonalization = {
  companionId?: string;
  companionName?: string;
  query?: string;
  refinements?: string[];
  previewQuestion?: string;
};
