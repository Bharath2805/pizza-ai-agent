// components/MenuDisplay.jsx - SIMPLE SLIDER WITHOUT EXTERNAL LIBRARIES
import React, { useState, useRef } from 'react';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';

const MenuDisplay = ({ menu }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  if (!menu) return (
    <div className="menu-display">
      <div className="loading-menu">
        <div className="loading-spinner-small"></div>
        <p>Loading menu...</p>
      </div>
    </div>
  );

  // Get unique categories
  const categories = ['all', ...new Set(menu.pizzas.map(pizza => pizza.category))];
  
  // Filter pizzas by category
  const filteredPizzas = activeCategory === 'all' 
    ? menu.pizzas 
    : menu.pizzas.filter(pizza => pizza.category === activeCategory);

  const getCategoryIcon = (category) => {
    const icons = {
      all: '🍕',
      classic: '👑',
      vegetarian: '🥬',
      specialty: '⭐',
      vegan: '🌱'
    };
    return icons[category] || '🍕';
  };

  const getCategoryColor = (category) => {
    const colors = {
      all: '#3498db',
      classic: '#3498db',
      vegetarian: '#27ae60',
      specialty: '#e74c3c',
      vegan: '#f39c12'
    };
    return colors[category] || '#3498db';
  };

  // Slider logic
  const pizzasPerSlide = 2; // Show 2 pizzas per slide
  const totalSlides = Math.ceil(filteredPizzas.length / pizzasPerSlide);
  const maxSlide = Math.max(0, totalSlides - 1);

  const nextSlide = () => {
    setCurrentSlide(prev => prev >= maxSlide ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => prev <= 0 ? maxSlide : prev - 1);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Reset slide when category changes
  React.useEffect(() => {
    setCurrentSlide(0);
  }, [activeCategory]);

  // Get pizzas for current slide
  const getCurrentPizzas = () => {
    const start = currentSlide * pizzasPerSlide;
    const end = start + pizzasPerSlide;
    return filteredPizzas.slice(start, end);
  };

  return (
    <div className="menu-display">
      <div className="menu-header">
        <h2>Our Menu</h2>
        <button 
          className="filter-toggle"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          title="Filter categories"
        >
          <Filter size={18} />
        </button>
      </div>
      
      {/* Category Filter */}
      <div className={`category-filter ${isFilterOpen ? 'open' : ''}`}>
        <div className="category-scroll">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(category);
                setIsFilterOpen(false);
              }}
              style={{
                borderColor: activeCategory === category ? getCategoryColor(category) : 'transparent',
                backgroundColor: activeCategory === category ? `${getCategoryColor(category)}20` : 'transparent'
              }}
            >
              <span className="category-icon">{getCategoryIcon(category)}</span>
              <span className="category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
            </button>
          ))}
        </div>
        {isFilterOpen && (
          <button 
            className="close-filter"
            onClick={() => setIsFilterOpen(false)}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="menu-container">
        {/* Pizzas Section with Custom Slider */}
        <div className="menu-section">
          <h3>
            {getCategoryIcon(activeCategory)} 
            {activeCategory === 'all' ? 'All Pizzas' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Pizzas`}
            <span className="item-count">({filteredPizzas.length})</span>
          </h3>
          
          {filteredPizzas.length > 0 ? (
            <div className="pizza-slider-container">
              {/* Slider Navigation */}
              {totalSlides > 1 && (
                <>
                  <button 
                    className="slider-btn slider-btn-prev"
                    onClick={prevSlide}
                    disabled={currentSlide === 0 && totalSlides === 1}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <button 
                    className="slider-btn slider-btn-next"
                    onClick={nextSlide}
                    disabled={currentSlide === maxSlide && totalSlides === 1}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              
              {/* Pizza Cards */}
              <div className="pizza-slider" ref={sliderRef}>
                <div 
                  className="pizza-slide-track"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  {Array.from({ length: totalSlides }, (_, slideIndex) => (
                    <div key={slideIndex} className="pizza-slide">
                      {filteredPizzas
                        .slice(slideIndex * pizzasPerSlide, slideIndex * pizzasPerSlide + pizzasPerSlide)
                        .map((pizza) => (
                          <div key={pizza.id} className="menu-item pizza-card">
                            <div className="item-header">
                              <h4>{pizza.name}</h4>
                              <div className="price">${pizza.price.toFixed(2)}</div>
                            </div>
                            <p className="description">{pizza.description}</p>
                            <div className="item-footer">
                              <span 
                                className={`category ${pizza.category}`}
                                style={{ backgroundColor: getCategoryColor(pizza.category) }}
                              >
                                {getCategoryIcon(pizza.category)} {pizza.category}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Slider Dots */}
              {totalSlides > 1 && (
                <div className="slider-dots">
                  {Array.from({ length: totalSlides }, (_, index) => (
                    <button
                      key={index}
                      className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="no-items">
              <p>No pizzas available in this category.</p>
            </div>
          )}
        </div>

        {/* Sizes Section */}
        <div className="menu-section">
          <h3>📏 Sizes</h3>
          <div className="sizes-list">
            {menu.sizes.map((size) => (
              <div key={size.id} className="size-item">
                <div className="size-info">
                  <span className="size-name">{size.name}</span>
                  <span className="size-detail">
                    {size.multiplier === 1 ? 'Base price' : `${size.multiplier}x base price`}
                  </span>
                </div>
                <div className="size-visual">
                  <div 
                    className="pizza-size-circle"
                    style={{
                      width: `${20 + (size.multiplier * 15)}px`,
                      height: `${20 + (size.multiplier * 15)}px`,
                      border: '2px solid #e67e22',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toppings Section */}
        <div className="menu-section">
          <h3>🧀 Extra Toppings</h3>
          <div className="toppings-grid">
            {menu.toppings.map((topping) => (
              <div key={topping.id} className="topping-item">
                <span className="topping-name">{topping.name}</span>
                <span className="topping-price">+${topping.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info */}
        <div className="menu-section">
          <div className="quick-info">
            <h4>💡 Quick Info</h4>
            <ul>
              <li>🚚 Free delivery over $25</li>
              <li>⏱️ 30-45 min delivery time</li>
              <li>🌱 Vegan options available</li>
              <li>🥜 Please mention allergies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDisplay;