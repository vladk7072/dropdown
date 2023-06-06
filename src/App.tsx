import { FC } from "react";
import "./app.scss";
import { Dropdown } from "./components/Dropdown";
import { items } from "./db/data";
import { itemsPhoto } from "./db/data";

export const App: FC = () => {
  return (
    <div className="wrapper">
      <Dropdown data={items} color="#3BD901" />
      <Dropdown data={items} color="#fff" backgroundColor="#D94A38" />

      {/* mode="photo" обязательно для кастомных айтемов в виде фото */}
      <Dropdown mode="photo" data={itemsPhoto} />
    </div>
  );
};
