import config from './config';

export const getDetail = (id: string | number) => {
  return fetch(`${config.host}/front/detail/item/${id}?timestamp=${Math.ceil(Date.now() / 1000)}`);
};
