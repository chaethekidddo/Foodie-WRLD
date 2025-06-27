import React, { useState, useEffect } from 'react';

const ChefHat = () => {
  return <span>👨‍🍳</span>;
};
const DollarSign = () => {
  return <span>💰</span>;
};
const ShoppingCart = () => {
  return <span>🛒</span>;
};
const Users = () => {
  return <span>👥</span>;
};
const TrendingUp = () => {
  return <span>📈</span>;
};
const Clock = () => {
  return <span>⏰</span>;
};

const FoodieWRLD = () => {
  const [money, setMoney] = useState(100);
  const [reputation, setReputation] = useState(50);
  const [day, setDay] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [unlockedRecipes, setUnlockedRecipes] = useState(['sandwich', 'salad']);
  const [dailyGoal, setDailyGoal] = useState(100);
  const [dayStartMoney, setDayStartMoney] = useState(100);
  const [goalAchieved, setGoalAchieved] = useState(false);
  
  const [inventory, setInventory] = useState({
    bread: 5,
    cheese: 3,
    tomato: 2,
    meat: 1,
    lettuce: 2,
    chicken: 0,
    bacon: 0,
    onion: 0
  });
  
  const [customers, setCustomers] = useState([]);
  const [completedOrders, setCompletedOrders] = useState(0);
  
  const ingredients = {
    bread: { cost: 1, emoji: '🍞' },
    cheese: { cost: 2, emoji: '🧀' },
    tomato: { cost: 2, emoji: '🍅' },
    meat: { cost: 5, emoji: '🥩' },
    lettuce: { cost: 2, emoji: '🥬' },
    chicken: { cost: 4, emoji: '🍗' },
    bacon: { cost: 6, emoji: '🥓' },
    onion: { cost: 1, emoji: '🧅' }
  };
  
  const allRecipes = {
    sandwich: { 
      ingredients: { bread: 2, cheese: 1 }, 
      price: 15, 
      emoji: '🥪',
      time: 3,
      unlockGoal: 0
    },
    salad: { 
      ingredients: { lettuce: 2, tomato: 1, cheese: 1 }, 
      price: 18, 
      emoji: '🥗',
      time: 2,
      unlockGoal: 0
    },
    burger: { 
      ingredients: { bread: 2, meat: 1, lettuce: 1 }, 
      price: 22, 
      emoji: '🍔',
      time: 5,
      unlockGoal: 120
    },
    chicken_sandwich: { 
      ingredients: { bread: 2, chicken: 1, lettuce: 1 }, 
      price: 20, 
      emoji: '🍗🥪',
      time: 4,
      unlockGoal: 150
    },
    deluxe_burger: { 
      ingredients: { bread: 2, meat: 1, cheese: 1, tomato: 1, lettuce: 1 }, 
      price: 30, 
      emoji: '🍔✨',
      time: 7,
      unlockGoal: 200
    },
    bacon_burger: { 
      ingredients: { bread: 2, meat: 1, bacon: 1, cheese: 1 }, 
      price: 35, 
      emoji: '🥓🍔',
      time: 8,
      unlockGoal: 280
    },
    mega_salad: { 
      ingredients: { lettuce: 3, tomato: 2, cheese: 1, chicken: 1, onion: 1 }, 
      price: 28, 
      emoji: '🥗👑',
      time: 6,
      unlockGoal: 350
    }
  };
  
  // Only show unlocked recipes
  const recipes = Object.fromEntries(
    Object.entries(allRecipes).filter(([name]) => unlockedRecipes.includes(name))
  );
  
  const customerNames = [
    'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Taylor', 'Avery',
    'Maria', 'Carlos', 'Aisha', 'Dmitri', 'Yuki', 'Priya', 'Ahmed', 'Sofia',
    'Chen', 'Isabella', 'Kwame', 'Zara', 'Raj', 'Emma', 'Olaf', 'Fatima',
    'Jin', 'Lucia', 'Kofi', 'Noor', 'Leo', 'Amara', 'Pablo', 'Kenji',
    'Zoe', 'Hassan', 'Luna', 'Diego', 'Anya', 'Omar', 'Lily', 'Xavier'
  ];
  
  useEffect(() => {
    if (reputation <= 0) {
      setIsGameOver(true);
      setIsGameRunning(false);
      return;
    }
    
    let timer;
    if (isGameRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Generate customers more frequently
        if (Math.random() < 0.4 && customers.length < 5) {
          const availableRecipes = Object.keys(recipes);
          const wantedDish = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
          const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
          
          setCustomers(prev => [...prev, {
            id: Date.now(),
            name: customerName,
            dish: wantedDish,
            patience: 15 + Math.floor(Math.random() * 10),
            maxPatience: 20
          }]);
        }
        
        setCustomers(prev => prev.map(customer => ({
          ...customer,
          patience: customer.patience - 1
        })).filter(customer => {
          if (customer.patience <= 0) {
            setReputation(prev => Math.max(0, prev - 3));
            return false;
          }
          return true;
        }));
        
      }, 1000);
    } else if (timeLeft === 0 && isGameRunning) {
      setIsGameRunning(false);
      // End of day - check if goal was met
      const dailyEarnings = money - dayStartMoney;
      if (dailyEarnings >= dailyGoal) {
        setGoalAchieved(true);
        setReputation(prev => prev + 5); 
        const nextRecipeToUnlock = Object.entries(allRecipes).find(([name, recipe]) => 
          !unlockedRecipes.includes(name) && dailyEarnings >= recipe.unlockGoal
        );
        if (nextRecipeToUnlock) {
          setUnlockedRecipes(prev => [...prev, nextRecipeToUnlock[0]]);
        }
      } else {
        setReputation(prev => Math.max(0, prev - 1)); 
      }
      setDay(prev => prev + 1);
      setTimeLeft(60);
      setCustomers([]);
      setDailyGoal(prev => Math.floor(prev * 1.2));
    }
    
    return () => clearTimeout(timer);
  }, [isGameRunning, timeLeft, customers.length, reputation, money, dayStartMoney, dailyGoal, unlockedRecipes]);
  
  const buyIngredient = (ingredient, amount = 1) => {
    const cost = ingredients[ingredient].cost * amount;
    if (money >= cost) {
      setMoney(prev => prev - cost);
      setInventory(prev => ({
        ...prev,
        [ingredient]: prev[ingredient] + amount
      }));
    }
  };
  
  const canMakeDish = (dishName) => {
    const recipe = recipes[dishName];
    return Object.entries(recipe.ingredients).every(([ingredient, needed]) => 
      inventory[ingredient] >= needed
    );
  };
  
  const cookDish = (dishName, customerId) => {
    if (!canMakeDish(dishName)) return;
    
    const recipe = recipes[dishName];
    
    const newInventory = { ...inventory };
    Object.entries(recipe.ingredients).forEach(([ingredient, amount]) => {
      newInventory[ingredient] -= amount;
    });
    setInventory(newInventory);
    
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    setMoney(prev => prev + recipe.price);
    setReputation(prev => prev + 1);
    setCompletedOrders(prev => prev + 1);
  };
  
  const startDay = () => {
    setIsGameRunning(true);
    setCompletedOrders(0);
    setDayStartMoney(money);
    setGoalAchieved(false);
  };
  
  const restartGame = () => {
    setMoney(100);
    setReputation(50);
    setDay(1);
    setTimeLeft(60);
    setIsGameRunning(false);
    setIsGameOver(false);
    setUnlockedRecipes(['sandwich', 'salad']);
    setDailyGoal(100);
    setDayStartMoney(100);
    setGoalAchieved(false);
    setInventory({
      bread: 5,
      cheese: 3,
      tomato: 2,
      meat: 1,
      lettuce: 2,
      chicken: 0,
      bacon: 0,
      onion: 0
    });
    setCustomers([]);
    setCompletedOrders(0);
  };
  
  const getTotalInventoryValue = () => {
    return Object.entries(inventory).reduce((total, [ingredient, amount]) => {
      return total + (ingredients[ingredient].cost * amount);
    }, 0);
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '24px'
  };

  const buttonStyle = {
    backgroundColor: '#f97316',
    color: 'white',
    fontWeight: 'bold',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const disabledButtonStyle = {
    backgroundColor: '#d1d5db',
    color: '#6b7280',
    cursor: 'not-allowed'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fed7aa 0%, #fecaca 100%)',
      padding: '16px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Game Over Screen */}
        {isGameOver && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }}>
                GAME OVER! 💀
              </h2>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>Your reputation dropped to 0!</p>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                You made it to Day {day} and earned ${money}
              </p>
              <button onClick={restartGame} style={buttonStyle}>
                Start New Game
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChefHat style={{ fontSize: '32px' }} />
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#374151', margin: 0 }}>
                Foodie WRLD
              </h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Day {day}</p>
              {isGameRunning && (
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
                  <Clock /> {timeLeft}s
                </p>
              )}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#dcfce7', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign />
                <span style={{ fontWeight: '600' }}>${money}</span>
              </div>
            </div>
            <div style={{ 
              backgroundColor: reputation <= 10 ? '#fee2e2' : '#dbeafe', 
              padding: '12px', 
              borderRadius: '8px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp />
                <span style={{ fontWeight: '600' }}>Rep: {reputation}</span>
              </div>
              {reputation <= 10 && <p style={{ fontSize: '12px', color: '#dc2626', margin: 0 }}>DANGER!</p>}
            </div>
            <div style={{ backgroundColor: '#e0e7ff', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users />
                <span style={{ fontWeight: '600' }}>Orders: {completedOrders}</span>
              </div>
            </div>
            <div style={{ backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart />
                <span style={{ fontWeight: '600' }}>Stock: ${getTotalInventoryValue()}</span>
              </div>
            </div>
            <div style={{ 
              backgroundColor: goalAchieved ? '#dcfce7' : '#fef3c7', 
              padding: '12px', 
              borderRadius: '8px' 
            }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Daily Goal</p>
              <p style={{ fontWeight: '600', fontSize: '14px', margin: 0 }}>
                ${Math.max(0, money - dayStartMoney)}/${dailyGoal}
              </p>
              {goalAchieved && <p style={{ fontSize: '12px', color: '#16a34a', margin: 0 }}>✅ ACHIEVED!</p>}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Customers */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users />
              Customers ({customers.length}/5)
            </h2>
            {customers.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '32px 0' }}>
                {isGameRunning ? "Waiting for customers..." : "Start the day to serve customers!"}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {customers.map(customer => {
                  const recipe = recipes[customer.dish];
                  const patiencePercent = (customer.patience / customer.maxPatience) * 100;
                  return (
                    <div key={customer.id} style={{ 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px', 
                      padding: '12px' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <p style={{ fontWeight: '600', margin: 0 }}>{customer.name}</p>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            Wants: {recipe.emoji} {customer.dish.replace('_', ' ')} (${recipe.price})
                          </p>
                        </div>
                        <button
                          onClick={() => cookDish(customer.dish, customer.id)}
                          disabled={!canMakeDish(customer.dish)}
                          style={{
                            ...buttonStyle,
                            padding: '8px 16px',
                            fontSize: '14px',
                            ...(canMakeDish(customer.dish) ? {} : disabledButtonStyle)
                          }}
                        >
                          Serve
                        </button>
                      </div>
                      <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
                        <div style={{
                          height: '8px',
                          borderRadius: '4px',
                          backgroundColor: patiencePercent > 50 ? '#22c55e' : patiencePercent > 25 ? '#eab308' : '#ef4444',
                          width: `${patiencePercent}%`,
                          transition: 'all 0.3s'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recipes */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChefHat />
              Menu ({Object.keys(recipes).length}/{Object.keys(allRecipes).length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {Object.entries(recipes).map(([dishName, recipe]) => (
                <div key={dishName} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <p style={{ fontWeight: '600', margin: 0 }}>{recipe.emoji} {dishName.replace('_', ' ')}</p>
                      <p style={{ fontSize: '14px', color: '#16a34a', fontWeight: '600', margin: 0 }}>${recipe.price}</p>
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: canMakeDish(dishName) ? '#dcfce7' : '#fee2e2',
                      color: canMakeDish(dishName) ? '#166534' : '#991b1b'
                    }}>
                      {canMakeDish(dishName) ? 'Available' : 'Need ingredients'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Needs: {Object.entries(recipe.ingredients).map(([ingredient, amount]) => 
                      `${amount}${ingredients[ingredient].emoji}`
                    ).join(' + ')}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Next Recipe to Unlock */}
            {(() => {
              const nextRecipe = Object.entries(allRecipes).find(([name, recipe]) => 
                !unlockedRecipes.includes(name)
              );
              return nextRecipe ? (
                <div style={{
                  border: '2px dashed #fbbf24',
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: '#fffbeb'
                }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', margin: '0 0 4px 0' }}>🔒 Next Unlock:</p>
                  <p style={{ fontSize: '14px', margin: 0 }}>{nextRecipe[1].emoji} {nextRecipe[0].replace('_', ' ')}</p>
                  <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                    Earn ${nextRecipe[1].unlockGoal} in a single day to unlock!
                  </p>
                </div>
              ) : (
                <div style={{
                  border: '2px dashed #22c55e',
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: '#f0fdf4'
                }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#166534', margin: 0 }}>🎉 All recipes unlocked!</p>
                  <p style={{ fontSize: '12px', color: '#166534', margin: 0 }}>You're a master chef!</p>
                </div>
              );
            })()}
          </div>

          {/* Shop & Inventory */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart />
              Shop & Inventory
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {Object.entries(ingredients).map(([ingredient, data]) => (
                <div key={ingredient} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '8px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{data.emoji}</span>
                    <div>
                      <p style={{ fontWeight: '600', textTransform: 'capitalize', margin: 0 }}>{ingredient}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>${data.cost} each</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      backgroundColor: '#f3f4f6', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '14px' 
                    }}>
                      {inventory[ingredient]}
                    </span>
                    <button
                      onClick={() => buyIngredient(ingredient, 1)}
                      disabled={money < data.cost}
                      style={{
                        ...buttonStyle,
                        padding: '6px 12px',
                        fontSize: '12px',
                        ...(money >= data.cost ? {} : disabledButtonStyle)
                      }}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {!isGameRunning && (
              <button
                onClick={startDay}
                style={{
                  ...buttonStyle,
                  width: '100%',
                  padding: '16px'
                }}
              >
                Start Day {day}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodieWRLD;
