/* eslint-disable */

import React, { Component } from 'react';
import "./styles/SummonerProfile.css";

const QUEUE_TYPES = {
    "RANKED_FLEX_SR": "Ranked Flex",
    "RANKED_SOLO_5x5": "Ranked Solo"
  }
  
const TIERS = {
"IRON": "Iron",
"BRONZE": "Bronze",
"SILVER": "Silver",
"GOLD": "Gold",
"PLATINUM": "Platinum",
"DIAMOND": "Diamond",
"MASTER": "Master",
"GRANDMASTER": "Grandmaster",
"CHALLENGER": "Challenger"
}
  
const LobbyType = ({queueType, tier, rank, leaguePoints, wins, losses}) => (
<div>
    <p>
    {queueType} <br />
    {tier} {rank} {leaguePoints }LP<br />
    Wins: {wins} Losses: {losses} <br /> 
    </p>
</div>
);

export class SummonerProfile extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        summonerByNameData: {},
        leagueEntriesBySummonerData: [],
        matchDataVisible: false,
        summonerFound: false
      };
    }

    showHiddenDiv = () => {
      this.setState(
        prevState => ({
          matchDataVisible: !prevState.matchDataVisible}));
      this.props.passToParent(this.state.summonerByNameData, !this.state.matchDataVisible);
    }

    async componentDidMount() {
      const summonerName = this.props.summonerName.toLowerCase().replace(/ /g, '');
      await this.getSummonerByName(summonerName);
      await this.getLeagueEntriesBySummoner(this.state.summonerByNameData.id)
      this.setState({
        summonerFound: true
      })
    }

    async getSummonerByName(summonerName) {
      var request = 'https://shao.lol/api/riot/summoner/' + summonerName
      let response = await fetch(request);
      let data = await response.json();
      // var currentSummoner = {};
      // currentSummoner[data.name.toLowerCase()] = data;
      this.setState({
        summonerByNameData: data,
      })
    }

    async getLeagueEntriesBySummoner(summonerId) {
      var request = 'https://shao.lol/api/riot/lolBySummoner/' + summonerId
      let response = await fetch(request);
      let data = await response.json();
      // var currentLeagueEntries = {};
      // currentLeagueEntries[data.Summonername.toLowerCase()] = data;
      this.setState({
        leagueEntriesBySummonerData: data,
      });
    }

    render() {
      return (
          this.state.summonerFound
          &&
        <div className='summonerProfile cursor-pointer' onClick={this.showHiddenDiv}>
            Tracking <b>{this.state.summonerByNameData.name} </b> <br />
            <img src={'https://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/' + this.state.summonerByNameData.profileIconId + '.png'}></img> <br />
            {this.state.summonerByNameData.summonerLevel} <br />
            {this.state.leagueEntriesBySummonerData.map((data) => (
            <LobbyType
            queueType={QUEUE_TYPES[data.queueType]}
            tier={TIERS[data.tier]}
            rank={data.rank}
            leaguePoints={data.leaguePoints}
            wins={data.wins}
            losses={data.losses}
            key={data.leagueId}
            />
            ))
            }
        </div>
      );
    }
  }