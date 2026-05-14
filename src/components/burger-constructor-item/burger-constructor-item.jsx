import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { ingredientPropType } from '@utils/prop-types';

import styles from './burger-constructor-item.module.css';

// Тип DnD-груза для перетаскивания ВНУТРИ конструктора.
// Отличается от типа 'ingredient' (перетаскивание из левого списка),
// чтобы не путать сортировку с добавлением.
const CONSTRUCTOR_ITEM_TYPE = 'constructor-item';

export const BurgerConstructorItem = ({ ingredient, index, onMove, onRemove }) => {
  // Реф на DOM-элемент — нужен и для useDrag (источник), и для useDrop
  // (цель ховера). Сначала создаём один общий реф, потом применяем
  // обе функции react-dnd к нему.
  const ref = useRef(null);

  // useDrag — этот элемент можно тащить.
  // item содержит index — он понадобится drop-логике, чтобы понять,
  // откуда тащит пользователь.
  const [{ isDragging }, dragRef] = useDrag({
    type: CONSTRUCTOR_ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // useDrop — на этот элемент можно бросить (или зависнуть над ним)
  // другой элемент того же типа. При hover делаем перестановку.
  const [, dropRef] = useDrop({
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

BurgerConstructorItem.propTypes = {
  ingredient: ingredientPropType.isRequired,
  index: PropTypes.number.isRequired,
  onMove: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
