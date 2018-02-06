const URL = "./";
const timeout = ms => new Promise(res => setTimeout(res, ms));

const fetchMenu = async () => {
  try {
    const { items } = await (await fetch(`${URL}items.json`)).json();
    await timeout(5000);
    return items;
  } catch (error) {
    console.log("Error fetchMenu : ", error);
  }
};

export { fetchMenu };
