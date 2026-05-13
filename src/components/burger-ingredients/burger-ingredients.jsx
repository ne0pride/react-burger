import { Tab } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useRef, useState } from 'react';

import { IngredientCard } from '@components/ingredient-card/ingredient-card';
import { ingredientPropType } from '@utils/prop-types';

import styles from './burger-ingredients.module.css';

const TAB_LABELS = {
  bun: 'Булки',
  sauce: 'Соусы',
  main: 'Начинки',
};

export const BurgerIngredients = ({ ingredients, onIngredientClick }) => {
  const [activeTab, setActiveTab] = useState('bun');

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
  }, []);

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

      <div ref={sectionsRef} className={`${styles.sections} custom-scroll mt-10`}>
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
                  count={1}
                  onClick={onIngredientClick}
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
  onIngredientClick: PropTypes.func.isRequired,
};
