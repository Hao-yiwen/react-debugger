import React, { useState, useEffect, useContext } from "react";

export const useFetch = (url, options = {}, deps = []) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [...deps]);

  return { data, error, loading };
};

// 创建一个简单的 ThemeContext
const ThemeContext = React.createContext("light");

// 模拟的 CircularProgress 组件，使用了 useContext 来获取主题
const CircularProgressWithTheme = () => {
  const theme = useContext(ThemeContext);
  const color = theme === "dark" ? "black" : "blue";

  return <div style={{ color }}>Loading...</div>;
};

// 主组件，模拟加载状态
const SingleAccountPage = () => {
  const { data, error, loading } = useFetch('https://jsonplaceholder.typicode.com/posts');


  if (loading) return <CircularProgressWithTheme />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Account: {data[0].name}</h1>
    </div>
  );
};

// 应用程序的根组件
const App = () => {
  return (
    <ThemeContext.Provider value="dark">
      <SingleAccountPage />
    </ThemeContext.Provider>
  );
};

export default App;
