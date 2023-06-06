import { FC, useEffect, useRef, useState } from "react";
import cn from "clsx";
import { Item, ItemPhoto } from "../types/dropdown.interface";
import { items } from "../db/data";

interface IProps {
  color?: string;
  backgroundColor?: string;
  data: Item[] | ItemPhoto[];
  mode?: string;
}

// выполнил условия задания кастомизации дропдауна, добавил возможность менять цвет айтемов и заднего фона айтемов
export const Dropdown: FC<IProps> = ({
  data,
  color,
  backgroundColor,
  mode,
}) => {
  const [isDropOpen, setDropOpen] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<number | null>(null);

  const [filteredItems, setFilteredItems] = useState<Item[]>(data);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    filterItems(event.target.value);
  };

  // ассинхронная функция запроса на сервер для фильтрации данных
  // в данном примере нигде не используется
  const filterAsyncItems = async (value: string) => {
    // проверка чтобы не ушел запрос на сервер с пустымы данными
    if (value === "") {
      setFilteredItems(items);
      return;
    }

    try {
      const response = await fetch(`/../..?value=${value}`);
      const data = await response.json();
      setFilteredItems(data);
    } catch (error) {
      console.error("Errors:", error);
    }
  };

  // фильтрация локальных данных
  const filterItems = (term: string) => {
    const filtered = data.filter((item) =>
      item.item.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  // обработчик клика вне дропдауна
  const windowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        windowRef.current &&
        !windowRef.current.contains(event.target as Node)
      ) {
        setDropOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={windowRef}>
      <div
        className={cn(
          "dropdown__window",
          isDropOpen && "dropdown__window--active"
        )}
        onClick={() => setDropOpen(!isDropOpen)}
      >
        {mode == "photo" ? (
          <>
            {selectItem != null ? (
              <img
                className="dropdown__image"
                src={selectItem != null ? data[selectItem].item : ""}
                alt=""
              />
            ) : (
              <div className="dropdown__window-title">Оберіть картинку</div>
            )}
          </>
        ) : (
          <div className="dropdown__window-title">
            {selectItem != null ? data[selectItem].item : "Оберіть ваше місто"}
          </div>
        )}
        <svg
          width="8"
          height="6"
          viewBox="0 0 8 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "dropdown__input-svg",
            isDropOpen && "dropdown__input-svg--active"
          )}
        >
          <path d="M4 6L0 0H8L4 6Z" fill="#333333" />
        </svg>
      </div>
      {isDropOpen && (
        <div className="dropdown__result">
          {mode !== "photo" && (
            <input
              className="dropdown__input"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Пошук..."
            />
          )}
          <ul className={mode == "photo" ? "dropdown__list-images" : "dropdown__list"}>
            {filteredItems.map((item) => (
              <>
                {mode == "photo" ? (
                  <img
                    src={item.item}
                    alt=""
                    key={item.id}
                    className={cn(
                      "dropdown__item dropdown__image",
                      selectItem === item.id && "dropdown__item--active"
                    )}
                    onClick={() => setSelectItem(item.id)}
                    style={{ backgroundColor: backgroundColor }}
                  />
                ) : (
                  <li
                    key={item.id}
                    className={cn(
                      "dropdown__item",
                      selectItem === item.id && "dropdown__item--active"
                    )}
                    onClick={() => setSelectItem(item.id)}
                    style={{ color: color, backgroundColor: backgroundColor }}
                  >
                    {item.item}
                  </li>
                )}
              </>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
