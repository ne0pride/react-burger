import { Tab } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IngredientCard } from '@components/ingredient-card/ingredient-card';
import { selectIngredientCounts } from '@services/burger-constructor/slice';
import { setIngredient } from '@services/ingredient-details/slice';
import { ingredientPropType } from '@utils/prop-types';

import styles from './burger-ingredients.module.css';

const TAB_LABELS = {
  bun: 'Булки',
  sauce: 'Соусы',
  main: 'Начинки',
};

export const BurgerIngredients = ({ ingredients }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('bun');

  const ingredientCounts = useSelector(selectIngredientCounts);

  const sectionsRef = useRef(null);
  const bunRef = useRef(null);
  const sauceRef = useRef(null);
  const mainRef = useRef(null);

  const sectionRefs = {
    bun: bunRef,
    sauce: sauceRef,
    main: mainRef,
  };

  const groupedIngredients = useMemo(() => {
    return {
      bun: ingredients.filter((item) => item.type === 'bun'),
      sauce: ingredients.filter((item) => item.type === 'sauce'),
      main: ingredients.filter((item) => item.type === 'main'),
    };
  }, [ingredients]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    const container = sectionsRef.current;
    const target = sectionRefs[tab].current;
    if (container && target) {
      const offset = target.offsetTop - container.offsetTop;
      container.scrollTo({ top: offset, behavior: 'smooth' });
    }
    // sectionRefs стабилен между рендерами.
  }, []);

  // Подсветка таба при скролле.
  // Чек-лист: «При скролле внутри компонента BurgerIngredients самый
  // ближний к левой верхней границе заголовок контейнера становится
  // активным, и для реализации этой функциональности использованы
  // рефы и метод getBoundingClientRect()».
  const handleScroll = useCallback(() => {
    const container = sectionsRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;

    // Считаем расстояние от верха контейнера до верха каждого заголовка.
    // Берём абсолютное значение, чтобы заголовок мог быть и выше, и ниже.
    const distances = Object.entries(sectionRefs).map(([type, ref]) => {
      if (!ref.current) return { type, distance: Infinity };
      const headingTop = ref.current.getBoundingClientRect().top;
      return { type, distance: Math.abs(headingTop - containerTop) };
    });

    // Тот, у кого расстояние минимально — активный.
    const closest = distances.reduce((min, curr) =>
      curr.distance < min.distance ? curr : min
    );

    // setActiveTab вызывается на каждый скролл, но React не сделает
    // ререндер, если новое значение равно текущему (Object.is сравнение).
    setActiveTab(closest.type);
    // sectionRefs стабилен между рендерами.
  }, []);

  const handleIngredientClick = useCallback(
    (ingredient) => {
      dispatch(setIngredient(ingredient));
    },
    [dispatch]
  );

  return (
    <section className={styles.burger_ingredients}>
      <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          <Tab value="bun" active={activeTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
          <Tab value="sauce" active={activeTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
          <Tab value="main" active={activeTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
        </ul>
      </nav>

      <div
        ref={sectionsRef}
        onScroll={handleScroll}
        className={`${styles.sections} custom-scroll mt-10`}
      >
        {Object.entries(groupedIngredients).map(([type, items]) => (
          <section key={type} className={styles.section}>
            <h2 ref={sectionRefs[type]} className="text text_type_main-medium mb-6">
              {TAB_LABELS[type]}
            </h2>
            <ul className={`${styles.list} pl-4 pr-4 pb-10`}>
              {items.map((ingredient) => (
                <IngredientCard
                  key={ingredient._id}
                  ingredient={ingredient}
                  count={ingredientCounts[ingredient._id] || 0}
                  onClick={handleIngredientClick}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(ingredientPropType).isRequired,
};
