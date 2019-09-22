export class Course {
  // tslint:disable-next-line: variable-name
  _id: string;
  title: string;
  // tslint:disable-next-line: variable-name
  code_name: string;
  desc: string;
  keywords: string;
  // tslint:disable-next-line: variable-name
  youtube_ref: string;
  category: string;
  publishedDate: Date;
  commentCount: number;
  duration: string;
  favoriteCount: number;
  dislike: number;
  like: number;
  rank: number;
  watched: number;
  tags: string [];
  slug: string;
  // tslint:disable-next-line: variable-name
  slide_link: string;
  comments: string[];
  isFavorited: boolean;
}
