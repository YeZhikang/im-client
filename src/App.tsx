import React, {useContext, useEffect, useState} from 'react'
import ReactDom from 'react-dom';
import {MessageProvider, MessageContext} from "./context/message-context";
import axios from 'axios';
import {Tabs} from "zent";
import {HashRouter as Router, Route, Switch, useHistory, useRouteMatch, Redirect} from 'react-router-dom'
import 'zent/css/index.css';
axios.defaults.baseURL = 'http://127.0.0.1:3020/api';
import img from "./static/image.png"
const TabPanel = Tabs.TabPanel;


// const Child = () => {
//     const messageContext = useContext(MessageContext);
//
//     const handleSend = async () => {
//         // messageContext?.sendMessage('message', 'hello')
//         const res = await axios.get('/user/cookie', {
//             withCredentials: true
//         });
//         messageContext?.connect();
//         console.log(res)
//     }
//
//     console.log(messageContext)
//     return (
//         <div>
//             Hello
//             <button onClick={handleSend}>click me</button>
//         </div>
//     )
// }

const TABS = [
    {
        value: 'active 1',
        id: 1
    },
    {
        value: 'active 2',
        id: 2
    },
    {
        value: 'active 3',
        id: 3
    }
]

const Child = ({children}) => {
    const [active, setActive] = useState(1);
    const history = useHistory();
    const router = useRouteMatch();

    const handleChange = (id) => {
        setActive(id);
        history.push(`${router.path}/${id}`)
    }

    useEffect(() => {
        console.log(history)
        const [empty, theme, id] = history.location.pathname.split('/');
        setActive(Number(id));
    }, [router])


    return (
        <div>
            <img src={img}/>
            <Tabs onChange={handleChange} activeId={active}>
                {
                    TABS.map(item => (
                        <TabPanel id={item.id} tab={item.value} key={item.id}/>
                    ))
                }
            </Tabs>
            <Switch>
                {
                    TABS.map(item => (
                        <Route exact key={item.id} path={`${router.path}/${item.id}`}><MyWord/></Route>
                    ))
                }
                {/*<Route path={`${router.path}/:id`}><MyWord/></Route>*/}
                <Redirect to={'/tag/1'}/>
            </Switch>
        </div>
    )
}

const MyWord = () => {
    const router = useRouteMatch();

    useEffect(() => {
        console.log('load')
        return () => console.log('unload')
    }, [])

    return (
        <div>{ router.path }</div>
    )
}

const App = () => {
    return (
        <MessageProvider>
            <Router>
                <Switch>
                    <Route path={'/tag'}>
                        <Child>
                            <MyWord/>
                        </Child>
                    </Route>
                </Switch>
            </Router>
        </MessageProvider>
    )
}

ReactDom.render(<App/>, document.querySelector('#app'));