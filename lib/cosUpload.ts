import COS from "cos-nodejs-sdk-v5";

export default async function cosUpload(file: string, fileName: string) {
  const cos = new COS({
    SecretId: process.env.COS_SECRETID,
    SecretKey: process.env.COS_SECRETKEY,
  });

  const params = {
    Bucket: "video-1255988328", // 替换为你的存储桶名称
    Region: "ap-nanjing", // 替换为你的存储桶所在区域
    Key: fileName, // 上传到 COS 的文件名
    FilePath: file
  };

  try {
    const data = await cos.uploadFile(params);
    // console.log("上传成功", data);
    return data?.Location
  } catch (error) {
    console.error("上传失败", error);
    return null
  }
}

export async function cosUploadBuffer(buffer: Buffer, fileName: string) {
  const cos = new COS({
    SecretId: process.env.COS_SECRETID,
    SecretKey: process.env.COS_SECRETKEY,
  });

  const params = {
    Bucket: "video-1255988328", // 替换为你的存储桶名称
    Region: "ap-nanjing", // 替换为你的存储桶所在区域
    Key: fileName, // 上传到 COS 的文件名
    Body: buffer
  };

  try {
    const data = await cos.putObject(params);
    // console.log("上传成功", data);
    return data?.Location
  } catch (error) {
    console.error("上传失败", error);
    return false
  }
}
