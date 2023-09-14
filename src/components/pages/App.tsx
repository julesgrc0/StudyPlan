import { useState, useCallback, useEffect, lazy } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useLocalStorage } from '../storage';
import { DEFAULT_STORAGE, PageAnimationType, RESOURCE_ID_NONE } from '../def';
import { LocalNotifications } from '@capacitor/local-notifications';

const Plan = lazy(() => import('./Plan'))
const Selection = lazy(() => import('./Selection'))

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
    const { storage, setStorage } = useLocalStorage("_storage", DEFAULT_STORAGE);


    useEffect(() => {
        if (storage.resourceId !== RESOURCE_ID_NONE)
        {
            let next = `/planning/${storage.resourceId}/${new Date().getTime()}`;
            navigate(next)
            setPath(next)
        }
        
        if (storage.notification)
        {
            LocalNotifications.checkPermissions().then(status => {
                if (status.display !== 'granted') {
                    LocalNotifications.requestPermissions().then(res => {
                        setStorage({ ...storage, notification: res.display === 'granted' })
                    })
                }
            })
        }
        
    }, [])

    const onChangePath = useCallback((path: string, type: PageAnimationType) => {
        if (type == PageAnimationType.SPEED) {
            setPath(path);
            setNextPath(path);
            navigate(path);
        } else {
            setAnimation("page-out" + type);
            setNextPath(path);
        }
    }, [setAnimation, setNextPath])


    return <div
        className={animation}
        onAnimationEnd={() => {
            if (animation.includes("out")) {
                setAnimation(animation.replace('out', 'in'));
                setPath(nextPath);
                navigate(nextPath)
            }
        }}
    >
        <Routes location={path}>
            <Route path="/" element={<Selection setPath={onChangePath} storage={storage} setStorage={setStorage} />} />
            <Route path="/planning/:id/:date" element={<Plan storage={storage} setStorage={setStorage} setPath={onChangePath} />} />
        </Routes>
    </div>
}