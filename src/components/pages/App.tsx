import { useState, useCallback } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { CourseItem } from '../def';
import { useLocalStorage } from '../storage';
import { Login } from './Login';
import { Plan } from './Plan';
import { Selection } from './Selection';

import '../styles/app.scss';

export const App = () => {


    return <BrowserRouter>
        <AnimatedRoutes />
    </BrowserRouter>
}


const AnimatedRoutes = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [path, setPath] = useState(location.pathname);
    const [nextPath, setNextPath] = useState(location.pathname);

    const [animation, setAnimation] = useState("page");
    const [items, setItems] = useState<CourseItem[]>([]);

    const [storage, setStorage] = useLocalStorage("_storage", {
        session: null,
        username: null,
        password: null
    });

    const onNext = useCallback(() => {

    }, [])

    const onPrev = useCallback(() => {

    }, [])

    const onChangePath = useCallback((path: string) => {
        setAnimation("page-out");
        setNextPath(path);
    }, [setAnimation, setNextPath])

    return <div
        className={animation}
        onAnimationEnd={() => {
            if (animation === "page-out") 
            {
                setAnimation("page-in");
                setPath(nextPath);
                navigate(nextPath)
            }
        }}
    >
        <Routes location={path}>
            <Route path="/" element={<Login storage={storage} setStorage={setStorage} setPath={onChangePath} />} />
            <Route path="/selection" element={<Selection setPath={onChangePath} />}  />
            <Route path="/planning" element={<Plan onNext={onNext} onPrev={onPrev} items={items} setPath={onChangePath} />} />
        </Routes>
    </div>
}