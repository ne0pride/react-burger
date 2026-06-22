import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { ConstructorIngredient } from '@utils/types';

import styles from './burger-constructor-item.module.css';

// Тип DnD-груза для перетаскивания ВНУТРИ конструктора.
// Отличается от типа 'ingredient' (перетаскивание из левого списка),
// чтобы не путать сортировку с добавлением.
const CONSTRUCTOR_ITEM_TYPE = 'constructor-item';

type DragItem = {
  index: number;
};

type BurgerConstructorItemProps = {
  ingredient: ConstructorIngredient;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (uniqueId: string) => void;
};

export const BurgerConstructorItem = ({
  ingredient,
  index,
  onMove,
  onRemove,
}: BurgerConstructorItemProps) => {
  // Реф на DOM-элемент — нужен и для useDrag (источник), и для useDrop
  // (цель ховера). Сначала создаём один общий реф, потом применяем
  // обе функции react-dnd к нему.
  const ref = useRef<HTMLLIElement>(null);

  // useDrag — этот элемент можно тащить.
  // item содержит index — он понадобится drop-логике, чтобы понять,
  // откуда тащит пользователь.
  const [{ isDragging }, dragRef] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: CONSTRUCTOR_ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // useDrop — на этот элемент можно бросить (или зависнуть над ним)
  // другой элемент того же типа. При hover делаем перестановку.
  const [, dropRef] = useDrop<DragItem>({
    accept: CONSTRUCTOR_ITEM_TYPE,
    hover: (draggedItem, monitor) => {
      // draggedItem — это { index } того элемента, который сейчас тащат.
      // ref.current — текущий элемент, над которым висит курсор.
      if (!ref.current) return;

      const fromIndex = draggedItem.index;
      const toIndex = index;

      // Если тащат сам себя — ничего не делаем.
      if (fromIndex === toIndex) return;

      // Определяем границы текущего элемента и позицию курсора.
      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverRect.top;

      // Логика «середины»: чтобы не дёргать перестановку при каждом
      // пикселе движения, делаем её только когда курсор пересечёт
      // середину текущего элемента. Это стандартный паттерн react-dnd.
      //
      // Тащим сверху вниз: перестановка только когда курсор НИЖЕ середины.
      if (fromIndex < toIndex && hoverClientY < hoverMiddleY) return;
      // Тащим снизу вверх: перестановка только когда курсор ВЫШЕ середины.
      if (fromIndex > toIndex && hoverClientY > hoverMiddleY) return;

      // Перестановка.
      onMove(fromIndex, toIndex);

      // Важно: обновляем index в данных перетаскиваемого элемента,
      // чтобы при следующих hover-событиях fromIndex был актуальным.
      // Если этого не сделать, элемент будет «прыгать» туда-сюда.
      draggedItem.index = toIndex;
    },
  });

  // Соединяем оба рефа на один элемент.
  // Сначала dragRef цепляется к ref, потом dropRef к тому же ref.
  dragRef(dropRef(ref));

  const opacity = isDragging ? 0.4 : 1;

  return (
    <li ref={ref} className={styles.item} style={{ opacity }}>
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => onRemove(ingredient.uniqueId)}
      />
    </li>
  );
};
