import React, { createContext, useState, ReactNode } from 'react';

interface ScoreContextProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  tasks: { [key: string]: boolean };
  setTaskCompleted: (task: string) => void;
}

export const ScoreContext = createContext<ScoreContextProps>({
  score: 0,
  setScore: () => {},
  tasks: {},
  setTaskCompleted: () => {},
});

interface ScoreProviderProps {
  children: ReactNode;
}

export const ScoreProvider: React.FC<ScoreProviderProps> = ({ children }) => {
  const [score, setScore] = useState(0);
  const [tasks, setTasks] = useState<{ [key: string]: boolean }>({});

  const setTaskCompleted = (task: string) => {
    setTasks((prev) => ({ ...prev, [task]: true }));
  };

  return (
    <ScoreContext.Provider value={{ score, setScore, tasks, setTaskCompleted }}>
      {children}
    </ScoreContext.Provider>
  );
};
