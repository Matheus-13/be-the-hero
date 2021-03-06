import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { FontAwesome } from '@expo/vector-icons';
import img_logo from '../../assets/logo.png';
import style from './style';

export default function Incidents() {
	const [incidents, setIncidents] = useState([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation();

	function navigateToDetail(incident) {
		navigation.navigate('Detail', {incident});
	}

	async function loadIncidents() {
		if (loading) return;
		if (total > 0 && incidents.length == total) return;
		
		setLoading(true);
		const res = await api.get('incidents', { params:{page} });
		setIncidents([...incidents, ...res.data]);
		setPage(page + 1);
		setLoading(false);
	}

	async function loadTotal() {
		const res = await api.get('incidents/total');
		setTotal(res.data.total);
	}

	useEffect(() => { loadIncidents(); }, []);
	useEffect(() => { loadTotal(); }, []);

	return(
		<View style={style.container}>
		  <View style={[style.container, style.header]}>
		    <Image source={img_logo} style={{ width:95, height:40, }}></Image>
		      <Text style={style.headerText}>
 						Total de <Text style={style.headerTextBold}>{total} casos</Text>.
		      </Text>
			</View>

		  <Text style={style.title}>Bem-vindo!</Text>
		  <Text style={style.description}>Escolha um dos casos abaixo e salve o dia.</Text>
			
			<FlatList showsVerticalScrollIndicator={false} data={incidents} keyExtractor={incident => String(incident.id)} style={style.incidentList} onEndReached={loadIncidents} onEndReachedThreshold={0.1}
			renderItem={({ item:incident }) => (
				<View style={style.incident}>
					<Text style={style.incidentProperty}>ONG:</Text>
					<Text style={style.incidentValue}>{incident.name}</Text>

					<Text style={style.incidentProperty}>CASO:</Text>
					<Text style={style.incidentValue}>{incident.title}</Text>

					<Text style={style.incidentProperty}>VALOR:</Text>
					<Text style={style.incidentValue}>{Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(incident.value)}</Text>
					
					<TouchableOpacity style={style.detailsButton} onPress={() => navigateToDetail(incident)}>
						<Text style={style.detailsButtonText}>Ver mais detalhes</Text>
						<FontAwesome name="arrow-right" size={18} color="#e02041" />
					</TouchableOpacity>
				</View>
			)} />

		</View>
	);
}