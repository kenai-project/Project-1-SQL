import React from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "100vw",
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const AnimatedRoutes = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        {React.Children.map(children, (child) => {
          return (
            <Route
              path={child.props.path}
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  style={{ height: "100%", width: "100%", minHeight: "100%" }}
                >
                  {child.props.element}
                </motion.div>
              }
            />
          );
        })}
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
