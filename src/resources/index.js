const URL = "./";

const fetchMenu = async () => {
  try {
    const { items } = await (await fetch(`${URL}items.json`)).json();
    return items;
  } catch (error) {
    console.log("Error fetchMenu : ", error);
  }
};

export { fetchMenu };
