import { createContext, useContext, useState } from 'react';

const RepresentativeContext = createContext();
export const useRepresentativeContext = () => useContext(RepresentativeContext);

const RepresentativeProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState([]);
  const [yourRepresentative, setYourRepresentative] = useState([]);
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false);
  const [showRepresentativeList, setShowRepresentativeList] = useState(true);
  const [searchParam, setSearchParam] = useState('');

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showRepresentative, setShowRepresentative] = useState(true);
  const [screen, setScreen] = useState(1);

  return (
    <RepresentativeContext.Provider
      value={{
        data,
        setData,
        step,
        setStep,
        scrolledPastThreshold,
        setScrolledPastThreshold,
        showRepresentativeList,
        setShowRepresentativeList,
        searchParam,
        setSearchParam,
        showSearchBar,
        setShowSearchBar,
        screen,
        setScreen,
        showRepresentative,
        setShowRepresentative,
        yourRepresentative,
        setYourRepresentative,
      }}
    >
      {children}
    </RepresentativeContext.Provider>
  );
};

export default RepresentativeProvider;
