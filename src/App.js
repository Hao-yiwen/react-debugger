import React, { useState, useEffect, useCallback } from "react";

// 第一层组件
const FirstLevelComponent = () => {
  const [firstLevelState, setFirstLevelState] = useState("1111111111");

  useEffect(() => {
    console.time("FirstLevelComponent render time");
    return () => {
      console.timeEnd("FirstLevelComponent render time");
    };
  });

  return (
    <div>
      <h1>First Level Component</h1>
      <p>{firstLevelState}</p>
      <SecondLevelComponent setFirstLevelState={setFirstLevelState} />
    </div>
  );
};

// 第二层组件
const SecondLevelComponent = ({ setFirstLevelState }) => {
  const [secondLevelState, setSecondLevelState] = useState("1111111111");

  const updateFirstLevelState = useCallback(() => {
    setSecondLevelState("2222222222");
    setFirstLevelState("2222222222");
  }, [setFirstLevelState]);

  useEffect(() => {
    console.time("SecondLevelComponent render time");
    return () => {
      console.timeEnd("SecondLevelComponent render time");
    };
  });

  return (
    <div>
      <h2>Second Level Component</h2>
      <p>{secondLevelState}</p>
      <ThirdLevelComponent setSecondLevelState={updateFirstLevelState} />
    </div>
  );
};

// 第三层组件
const ThirdLevelComponent = ({ setSecondLevelState }) => {
  const [thirdLevelState, setThirdLevelState] = useState("11111");

  const handleClick = () => {
    // 更新第三层组件的 state
    setTimeout(() => {
      setThirdLevelState("33333333");
    }, 1000);
    setThirdLevelState("2222222");

    // 同时触发第二层组件的 hook
    setSecondLevelState("2222222");
  };

  useEffect(() => {
    console.time("ThirdLevelComponent render time");
    return () => {
      console.timeEnd("ThirdLevelComponent render time");
    };
  });

  return (
    <div>
      <h3>Third Level Component</h3>
      <p>{thirdLevelState}</p>
      <button onClick={handleClick}>Update State</button>
    </div>
  );
};

// 渲染第一层组件
const App = () => {
  return (
    <div>
      <FirstLevelComponent />
    </div>
  );
};

export default App;