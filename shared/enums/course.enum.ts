export enum ECourseType {
  ShortTerm = 'short_term',
  LongTerm = 'long_term',
}

export enum ECourseLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Expert = 'expert',
}

export enum ECourseStatus {
  Draft = 'draft',
  Private = 'private_noindex',
  Redirect = 'redirect_noindex',
  PublicNoIndex = 'public',
  PublicIndex = 'public_index',
  Deleted = 'deleted',
}

export enum ECourseForm {
  Online = 'online',
  Offline = 'offline',
  OnlineAndOffline = 'online_offline',
}
