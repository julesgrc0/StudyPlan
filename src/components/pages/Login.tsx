import { useState, useCallback } from 'react';
import { VStack, Text, Input, Checkbox, Button, IconButton } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

import { LOGIN_URL, getSession } from '../api'
import Logo from '../../assets/logo.svg'
import '../styles/login.scss'

type LoginProps = {
    storage: object;
    
    setStorage: (value: object) => void;
    setPath: (path: string) => void;
}
type PasswordInputProsp = {
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const PasswordInput = ({ value, onChange }: PasswordInputProsp) => {
    const [show, setShow] = useState(false)

    return (
        <div className='pass-input'>
            <Input type={show ? 'text' : 'password'} value={value} onChange={onChange} />
            <IconButton aria-label="" icon={show ? <ViewIcon /> : <ViewOffIcon />} onClick={() => setShow(!show)} />
        </div>
    )
}



export const Login = ({ storage, setStorage, setPath }: LoginProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [save, setSave] = useState<boolean>(true);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const onLogin = useCallback(() => {
        if (loading) {
            return;
        }
        setLoading(true);

        getSession(LOGIN_URL, username, password)
            .then(session => {
                if (session == null) {
                    setPassword("");
                    setError("Mauvais identifiant / mot de passe.")
                    setLoading(false);
                    setPath('/selection')
                    return;
                }

                if (save) 
                {
                    setStorage({
                        ...storage,
                        session,
                        username,
                        password
                    });
                }
                setError("")
                setLoading(false);
                setPath('/selection');
            }).catch(() => {
                setLoading(false);
            })
    }, [storage, save, username, password, loading, setPath, setPassword, setLoading, setStorage, setError])

    return <div className='login'>
        <img src={Logo} className='logo' />
        <VStack className='main'>
            <div>
                <Text className='label'>Identifiant</Text>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <Text className='label'>Mot de passe</Text>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Checkbox colorScheme='blackAlpha' alignSelf={'flex-start'} isChecked={save} onClick={() => setSave(!save)}>Rester connecter</Checkbox>
            <Text alignSelf={'flex-start'} mb='-20px' color={'red.500'}>
                {error}
            </Text>
        </VStack>
        <Button className='btn' pos={'relative'} mt='25px' bg='black' colorScheme='blackAlpha' w='80%' isLoading={loading} onClick={onLogin}>Se connecter</Button>
    </div>
}