import axiosinstanceserver from "./axios_instance_server";

interface Params {
  method: string;
}

// Server
const serverGetConfig: Params = {
  method: "get",
};

export const serverGetAPI = async (url: string, data: any): Promise<any> => {
  try {
    const response = await axiosinstanceserver({
      ...serverGetConfig,
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

const serverPostConfig: Params = {
  method: "post",
};

export const serverPostAPI = async (url: string, data: any): Promise<any> => {
  try {
    const response = await axiosinstanceserver({
      ...serverPostConfig,
      url: url,
      data: data,
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
