import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function PrayersCard({name,time}) {
    return (
        <Card className='card' sx={{ maxWidth: 345 }}>
            <CardContent>
            <Typography fontFamily={'Cairo'} variant="h2" component="div">
                {name} 
            </Typography>
            <Typography variant="h2" fontWeight={'500'} sx={{ color: 'text.secondary' }}>
                {time}
            </Typography>
            </CardContent>
            
        </Card>
);
}