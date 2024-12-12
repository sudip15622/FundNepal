"use server"

export const isValidAvatar = async (url) => {
    try {
      const res = await fetch(url);
      const contentType = res.headers.get('content-type');
      console.log(res);
      if(res.ok && contentType && contentType.startsWith('image/')) {
        return { success: true };
      }
      return {success: false, error: "Invalid Avatar Url!"};
    } catch (error) {
      return { success: false, error: error.message || "Invalid Avatar Url!" };
    }
  };
