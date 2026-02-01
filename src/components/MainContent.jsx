
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import PrayersCard from './Card';
import axios from "axios"
import { useEffect,useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from "moment";
import 'moment/dist/locale/ar-kw'

export default function MainContent({changeDirection}){
    const Cities={
        'Cairo':{cityName:'Cairo',country:'EG'},
        'Makkah':{cityName:'Makkah',country:'SA'},
        'Alexandria':{cityName:'Alexandria',country:'EG'},
        'Alriyadh':{cityName:'Alriyadh',country:'SA'},
    }
    const [prayersTiming,setPrayersTiming] =useState({});
    const [city,setCity] = useState('Cairo') ;
    const [lang,setLang] = useState("ar");
    const [today,setToday] =useState("");
    const [timer,setTimer] = useState("00:00:00");
    const [nextPrayerName,setNextPrayerName] =useState("")
     //translate
    
    const { t, i18n } = useTranslation();

    useEffect(()=>{
        i18n.changeLanguage(lang);
        moment.locale(lang); 
    },[lang]);

    useEffect(()=>{
        
        let selectedCity=Cities[city];
        if (!selectedCity) return;
        axios.get(`https://api.aladhan.com/v1/timingsByCity?country=${selectedCity.country}&city=${city}`)
        .then(function (response) {
            // handle success
            setPrayersTiming(response.data.data.timings);
        })
        .catch(function (error) {
            alert("there is an errors" + error);
        });

    },[city]);
    
    useEffect(() => {
        const timeAndDate = setInterval(() => {
            setToday(moment().format('MMMM Do YYYY | h:mm '));
        }, 1000);

        return () => clearInterval(timeAndDate);
    }, []);

    //timer for next pray
        
    useEffect(() => {
        const timerInterval = setInterval(() => {
            if (Object.keys(prayersTiming).length === 0) return;
            const momentNow = moment();
            const timings={
                'Fajr':prayersTiming.Fajr,
                'Dhuhr':prayersTiming.Dhuhr,
                'Asr':prayersTiming.Asr,
                'Maghrib':prayersTiming.Maghrib,
                'Isha':prayersTiming.Isha
            }
            
            let prayersIndex= 0;;
            if(momentNow.isAfter(moment(timings["Fajr"],"HH:mm")) &&momentNow.isBefore(moment(timings["Dhuhr"],"HH:mm"))){
                setNextPrayerName("Dhuhr");
                prayersIndex=1;
            }else if(momentNow.isAfter(moment(timings["Dhuhr"],"HH:mm")) && momentNow.isBefore(moment(timings["Asr"],"HH:mm"))){
                setNextPrayerName("Asr");
                prayersIndex=2;
            }else if(momentNow.isAfter(moment(timings["Asr"],"HH:mm")) && momentNow.isBefore(moment(timings["Maghrib"],"HH:mm"))){
                setNextPrayerName("Maghrib");
                prayersIndex=3;
            }else if(momentNow.isAfter(moment(timings["Maghrib"],"HH:mm")) && momentNow.isBefore(moment(timings["Isha"],"HH:mm"))){
                setNextPrayerName("Isha");
                prayersIndex=4;
            }else{
                setNextPrayerName("Fajr");
                prayersIndex=0;
            };

            const theNextPrayerTime =timings[`${Object.keys(timings)[prayersIndex]}`];
            if (!theNextPrayerTime) return;
            
            let nextPrayerMoment = moment(theNextPrayerTime, "HH:mm").set({
                year: momentNow.year(),
                month: momentNow.month(),
                date: momentNow.date(),
            });
            if(Object.keys(timings)[prayersIndex] === "Fajr"){
                nextPrayerMoment.add(1, 'days'); 
            }
            
            const remainingTime =nextPrayerMoment.diff(momentNow);
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                setTimer("00:00:00");
                return;
            }
            const durationRemainingTime = moment.duration(remainingTime);
            setTimer(`${durationRemainingTime.hours()}:${durationRemainingTime.minutes()}:${durationRemainingTime.seconds()}`)
            if (timer === 0 ) clearInterval(timerInterval);
        }, 1000);


        return () => clearInterval(timerInterval);

    }, [prayersTiming]);
    
    //handler
    const handleCityChange = (e)=>{
        setCity(e.target.value);
    };
    const handleLangChange =(e)=>{
        setLang(e.target.value);
        changeDirection(lang);
    }
    
    return(
        <>
        <Grid container  spacing={2} sx={{textAlign:'center', color:'#fff'}}>
            <Grid size={6}>
                <div>
                    <h2>{today}</h2>
                    <h1>{t(city)}</h1>
                </div>
            </Grid>
            <Grid size={6}>
                <div>
                    <h2 style={{fontFamily:'Cairo'}}>{t("The remaining time to") + " "+t(nextPrayerName)} </h2>
                    <h1>{timer}</h1>
                </div>
            </Grid>
        </Grid>
        <Divider sx={{borderWidth:'2px',borderColor:'#fff',opacity:'0.5'}} />
        <Stack direction={'row'} justifyContent={'space-around'} marginTop={'50px'}>
            <PrayersCard name={t('Isha')} time={prayersTiming.Isha} />
            <PrayersCard name={t('Maghrib')} time={prayersTiming.Maghrib} />
            <PrayersCard name={t('Asr')} time={prayersTiming.Asr} />
            <PrayersCard name={t('Dhuhr')} time={prayersTiming.Dhuhr} />
            <PrayersCard name={t('Fajr')} time={prayersTiming.Fajr} />
            
        </Stack>
        <Stack direction={'row'}  marginTop={'50px'} justifyContent={'space-around'} >
            <FormControl sx={{width:'25%'}} >
                <InputLabel id="selected-city" sx={{color:'#000' ,fontSize:'20px'}}>City</InputLabel>
                <Select
                sx={{backgroundColor:'#fff'}}
                labelId="selected-city"
                id="demo-city-select"
                value={city}
                label="city"
                onChange={handleCityChange}
                >
                <MenuItem value={'Cairo'}>{t('Cairo')}</MenuItem>
                <MenuItem value={'Makkah'}>{t('Makkah')}</MenuItem>
                <MenuItem value={'Alexandria'}>{t('Alexandria')}</MenuItem>
                <MenuItem value={'Alriyadh'}>{t('Alriyadh')}</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{width:'25%'}}>
                <InputLabel id="selected-language" sx={{color:'#000',fontSize:'20px'}}>Language</InputLabel>
                <Select
                labelId="selected-language"
                id="demo-language-select"
                sx={{backgroundColor:'#fff'}}
                value={lang}
                label="language"
                onChange={handleLangChange}
                >
                <MenuItem value={'ar'}>عربى</MenuItem>
                <MenuItem value={'en'}>English</MenuItem>
                </Select>
            </FormControl>
        </Stack>
        </>
    )
}