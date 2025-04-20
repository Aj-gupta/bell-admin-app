import axiosinstance from "./axios_instance";

interface Params {
  method: string;
}

const postConfig: Params = {
  method: "post",
};

export const postAPI = async (url: string, data: any): Promise<any> => {
  return await axiosinstance({
    ...postConfig,
    url: `${url}`,
    data,
  })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch((error) => {
      console.log("reesEsrro", error);
      return {
        status: error.status,
        data: error.response,
      };
    });
};

const getConfig: Params = {
  method: "get",
};

export const getAPI = async (url: string, data: any): Promise<any> => {
  try {
    const response = await axiosinstance({
      ...getConfig,
      withCredentials: false,
      url: data ? `${url}/${data}` : url,
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log("error", error);
    return {
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

export const getExternalAPI = async (
  baseURL: string,
  url: string,
  data?: any
): Promise<any> => {
  try {
    const response = await axiosinstance({
      baseURL,
      ...getConfig,
      url: data ? `${url}/${data}` : url,
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

const patchConfig: Params = {
  method: "patch",
};

export const patchAPI = async (url: string, data: any): Promise<any> => {
  try {
    const response = await axiosinstance({
      ...patchConfig,
      withCredentials: false,
      url: `${url}`,
      data,
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

export function formatNumber(num: number) {
  let formattedNum = Math.abs(num).toFixed(2);

  if (num > 0) {
    formattedNum = "+" + formattedNum;
  } else if (num < 0) {
    formattedNum = "-" + formattedNum;
  }

  return formattedNum;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
