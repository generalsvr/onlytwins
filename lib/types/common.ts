export interface Request {
  error?:{
    message: string;
  }
  status?: number
}

export interface Response {
  error?:{
    message: string;
  }
}