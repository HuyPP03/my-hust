export default function DatePage(date) {
  if (date !== "") {
    const dateObject = new Date(date);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1; // Lưu ý rằng tháng trong JavaScript bắt đầu từ 0
    const year = dateObject.getFullYear();

    // Sử dụng template string để định dạng ngày theo "DD/MM/YYYY"
    return `${day < 10 ? `0${day}` : day}/${
      month < 10 ? `0${month}` : month
    }/${year}`;
  }
  return "";
}
