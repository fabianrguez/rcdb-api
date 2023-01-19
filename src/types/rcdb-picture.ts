type RcdbPictureSize = {
  width: number;
  height: number;
  url: string;
};

export default interface RcdbPicture {
  id: number;
  url: string;
  width: number;
  height: number;
  offset: number;
  name: string;
  copy_date: string;
  copy_name: string;
  copy_id: number;
  sizes: RcdbPictureSize[];
}
