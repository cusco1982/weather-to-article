import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Card } from "@material-ui/core";
import WeatherCard from "../components/WeatherCard";
import { getStoredOptions, LocalStorageOptions } from "../utils/storage";
import { Messages } from "../utils/messages";
import './contentScript.css';


type MessageListener = (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
) => void;




const App: React.FC<{}> = () => {
    const [options, setOptions] = useState<LocalStorageOptions | null>(null)
    const [isActive, setIsActive] = useState<boolean>(false)


    const currentListener = useRef<MessageListener>(null)

    useEffect(() => {

        getStoredOptions().then((options) => {
            setOptions(options)
            setIsActive(options.hasAutoOverlay)
        })

    }, [])



    useEffect(() => {


        if (currentListener.current) {
            chrome.runtime.onMessage.removeListener(currentListener.current)
        }

        currentListener.current = (message: Messages) => {
            if (message === Messages.TOGGLE_OVERLAY) {
                setIsActive(!isActive)
            }
        }


        chrome.runtime.onMessage.addListener(currentListener.current)



    }, [isActive])




    if (!options) {
        return null
    }



    return (

        <>

            {isActive && (

                <Card className="overlayCard">
                    <WeatherCard
                        city={options.homeCity}
                        tempScale={options.tempScale}
                        onDelete={() => setIsActive(false)}
                    />
                </Card>

            )}

        </>
    )
};





const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)