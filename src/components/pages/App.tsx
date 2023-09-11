import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useLocalStorage } from '../storage';
import { Login } from './Login';
import { Plan } from './Plan';
import { Selection } from './Selection';

import '../styles/app.scss';
import { DEFAULT_STORAGE } from '../def';

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
    const [storage, setStorage] = useLocalStorage("_storage", DEFAULT_STORAGE);


    useEffect(() => {
        if(storage.session != null)
        {
            navigate(`/planning/${storage.resourceId}/${new Date().getTime()}`)
        }
    }, [])

    const onChangePath = useCallback((path: string, rev: boolean) => {
        if(rev)
        {
            setAnimation("page-out-rev");
        }else{
            setAnimation("page-out");
        }
        setNextPath(path);
    }, [setAnimation, setNextPath])

    return <div
        className={animation}
        onAnimationEnd={() => {
            if (animation === "page-out" || animation === "page-out-rev") 
            {
                setAnimation(animation == "page-out" ? "page-in" : "page-in-rev");
                setPath(nextPath);
                navigate(nextPath)
            }
        }}
    >
        <Routes location={path}>
            <Route path="/" element={<Login storage={storage} setStorage={setStorage} setPath={onChangePath} />} />
            <Route path="/selection" element={<Selection setPath={onChangePath} storage={storage} setStorage={setStorage} />}  />
            <Route path="/planning/:id/:date" element={<Plan storage={storage} setStorage={setStorage} setPath={onChangePath} />} />
        </Routes>
    </div>
}