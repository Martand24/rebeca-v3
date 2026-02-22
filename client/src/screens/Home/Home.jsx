import "./Home.css";
import Heading from "../../components/Headingv2/Headingv2";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import ArtistList from "../../components/ArtistList/ArtistList";
import Nightbanner from "../../components/Nightbanner/Nightbanner";
import CollageHeart from "../../components/CollageHeart/CollageHeart";
import Hero from "../../components/ScrollFancy/Hero";
import CountDown from "../../components/CountDown/CountDown";
import Schedule from "../Schedule_new/Schedule"

const artists = [
    { name: "Amit Mishra", img: "AmitMishra.png" },
    { name: "Anupam Roy Band", img: "AnupamRoyBand.png" },
    { name: "Anurag Halder", img: "anuraghalder.png" },
    { name: "Arunashish Roy", img: "ArunashishRoy.png" },
    { name: "Ash King", img: "ashking.png" },
    { name: "Avoid Rafa", img: "avoidrafa.png" },
    { name: "Distorted Chromosomes", img: "destortedchromosomes.png" },
    { name: "DJ Neelashree", img: "djneelashree.png" },
    { name: "DJ Raxo", img: "djraxo.png" },
    { name: "DJ Roop", img: "djroop.png" },
    { name: "Fakir Band", img: "FakirBand.png" },
    { name: "Jannat Sufi Band", img: "JannatSufiBand.png" },
    { name: "MD Irfan", img: "mdirfan.png" },
    { name: "M Sonic", img: "MSonic.png" },
    { name: "Pata", img: "pata.png" },
    { name: "Pritam Roy", img: "pritamroy.png" },
    { name: "Prithbi", img: "prithbi.png" },
    { name: "Senjuti Das", img: "SenjutiDas.png" }
]

const Home = () => {
    return (
        <div className="home">
            <div className="wave-bg">
                <img src="/assets/imgs/home/wavy_bg.webp" alt="" />
            </div>
            <Hero />
            <section className="section-2">
                <div className="banner">
                    <div className="">BEings, are you ready?</div>
                    <div className="">the countdown to our very own Pujo has already begun!</div>
                </div>
            </section>
            <section className="section-3">
                <h1 className="date">MARCH 19-22</h1>
                <h4>Lords' Ground, IIEST Shibpur</h4>
                <p>
                    Prepare to be swept away as you put your best foot forward in this epic celebration of creativity
                    and culture that promises you laughter, joy and memories that will last you a lifetime and more.
                </p>
            </section>
            <section className="section-4 ">
                <Heading title={"ARTISTS"} />
                <ArtistList artists={artists} />
            </section>
            <section className="section-5" style={{marginTop: "8rem"}}>
                <Heading title={"SCHEDULE"} />
                <Schedule />
            </section>
            <section className="section-6">
                <h1>MOMENTS</h1>
                <h4>That last a lifetime</h4>
                <CollageHeart />
            </section>
            <CountDown />
        </div>
    );
};

export default Home;
