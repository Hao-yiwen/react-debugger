import React, { useState, useEffect, useCallback, useRef } from "react";

// 模拟复杂异步操作
const simulateAsyncOperation = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");
    }, 500); // 模拟500ms的异步操作
  });
};

// 第一层组件
const FirstLevelComponent = () => {
  const [firstLevelState, setFirstLevelState] = useState("1111111111");

  useEffect(() => {
    console.log(performance.now() + ' FirstLevelComponent render time');
    return () => {
      console.log(performance.now() + ' FirstLevelComponent remove render time');
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
  const thirdInputRef = useRef(null);
  const thirdViewRef = useRef(null);
  const [isShowThirdLevel, setIsShowThirdLevel] = useState(true);

  const updateFirstLevelState = useCallback(
    async (ref, viewRef) => {
      thirdInputRef.current = ref;
      thirdViewRef.current = viewRef;
      setSecondLevelState("2222222222");
      await simulateAsyncOperation();
      thirdInputRef.current.focus();
      thirdViewRef.current.style.backgroundColor = "red";
      setFirstLevelState("2222222222");
      setIsShowThirdLevel(false);
    },
    [setFirstLevelState]
  );

  useEffect(() => {
    console.log(performance.now() + " SecondLevelComponent render time");
    return () => {
      console.log(
        performance.now() + " SecondLevelComponent remove render time"
      );
    };
  });

  return (
    <div>
      <h2>Second Level Component</h2>
      <p>{secondLevelState}</p>
      {isShowThirdLevel && <ThirdLevelComponent setSecondLevelState={updateFirstLevelState} />}
    </div>
  );
};

// 第三层组件
const ThirdLevelComponent = ({ setSecondLevelState }) => {
  const [thirdLevelState, setThirdLevelState] = useState("11111");
  const inputRef = useRef(null);
  const viewRef = useRef(null);

  const handleClick = () => {
    // 更新第三层组件的 state
    setThirdLevelState("2222222");

    // 同时触发第二层组件的 hook
    setTimeout(() => {
      setSecondLevelState(inputRef.current, viewRef.current);
    }, 100);
  };

  useEffect(() => {
    console.log(performance.now() + " ThirdLevelComponent render time");
    return () => {
      console.log(
        performance.now() + " ThirdLevelComponent remove render time"
      );
    };
  });

  return (
    <div ref={viewRef}>
      <h3>Third Level Component</h3>
      <p>{thirdLevelState}</p>
      <input placeholder="focus me" ref={inputRef} />
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
