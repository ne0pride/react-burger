import { Tab } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { IngredientCard } from '@components/ingredient-card/ingredient-card';
import { selectIngredientCounts } from '@services/burger-constructor/slice';
import { ingredientPropType } from '@utils/prop-types';

import styles from './burger-ingredients.module.css';

const CATEGORIES = [
  { key: 'bun', title: 'Булки' },
  { key: 'sauce', title: 'Соусы' },
  { key: 'main', title: 'Начинки' },
];

export const BurgerIngredients = ({ ingredients }) => {
  const [currentTab, setCurrentTab] = useState('bun');
  const counts = useSelector(selectIngredientCounts);

  const containerRef = useRef(null);
  const titlesRef = useRef({});

  const groupedIngredients = useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
      acc[category.key] = ingredients.filter((item) => item.type === category.key);
      return acc;
    }, {});
  }, [ingredients]);

  // При скролле определяем какой заголовок ближе к верху — выделяем нужный таб.
  // Чек-лист: «использованы рефы и метод getBoundingClientRect()».
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.getBoundingClientRect().top;

    let closestCategory = currentTab;
    let minDistance = Infinity;

    CATEGORIES.forEach((category) => {
      const titleElement = titlesRef.current[category.key];
      if (!titleElement) return;
      const titleTop = titleElement.getBoundingClientRect().top;
      const distance = Math.abs(titleTop - containerTop);
      if (distance < minDistance) {
        minDistance = distance;
        closestCategory = category.key;
      }
    });

    if (closestCategory !== currentTab) {
      setCurrentTab(closestCategory);
    }
  }, [currentTab]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleTabClick = (value) => {
    setCurrentTab(value);
    const target = titlesRef.current[value];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={`${styles.burger_ingredients} pt-10`}>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {CATEGORIES.map((category) => (
            <Tab
              key={category.key}
              value={category.key}
              active={currentTab === category.key}
              onClick={handleTabClick}
            >
              {category.title}
            </Tab>
          ))}
        </ul>
      </nav>
      <div ref={containerRef} className={`${styles.sections} custom-scroll mt-10`}>
        {CATEGORIES.map((category) => (
          <div key={category.key} className={styles.section}>
            <h2
              ref={(el) => (titlesRef.current[category.key] = el)}
              className="text text_type_main-medium"
            >
              {category.title}
            </h2>
            <ul className={`${styles.list} mt-6 mb-10`}>
              {groupedIngredients[category.key]?.map((ingredient) => (
                <IngredientCard
                  key={ingredient._id}
                  ingredient={ingredient}
                  count={counts[ingredient._id] || 0}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(ingredientPropType).isRequired,
};
