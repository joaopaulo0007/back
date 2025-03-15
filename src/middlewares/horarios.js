import { json } from "express";
// Função para adicionar dias a uma data
const adicionarDias = (data, dias) => {
    let novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    return novaData;
};

// Função para verificar se um horário está dentro de um intervalo
const horarioDentroIntervalo = (horario, inicio, fim) => {
    return horario >= inicio && horario < fim;
};
const horarioDia = (dataInicial, listaHorarios, listaHorariosAgendados) => {
    let partes = dataInicial.split("-");
    let dataAtual = new Date(partes[0], partes[1] - 1, partes[2]); // Criando a data corretamente no fuso local
    dataAtual.setHours(0, 0, 0, 0); // Normaliza para início do dia

    let diaSemanaAtual = dataAtual.getDay();
    console.log("dia da semana passado: ", diaSemanaAtual);

    let diasTrabalhando = listaHorarios.filter(horario => horario.dia_semana == diaSemanaAtual);
    
    if (diasTrabalhando.length === 0) {
        return null;
    }

    console.log("Data Inicial:", dataInicial);
    console.log("Data Atual Ajustada:", dataAtual);
    console.log("Dias Trabalhando:", diasTrabalhando[0]);

    let horariosDisponiveis = [];

    for (let dia of diasTrabalhando) {
        let dataConsulta = new Date(dataAtual);
        dataConsulta.setHours(0, 0, 0, 0);

        let [horaInicio, minutoInicio] = dia.horario_inicio.split(":").map(Number);
        let [horaFim, minutoFim] = dia.horario_fim.split(":").map(Number);

        let inicioExpediente = new Date(dataConsulta);
        inicioExpediente.setUTCHours(horaInicio, minutoInicio, 0, 0); // Alterado para `setHours`

        let fimExpediente = new Date(dataConsulta);
        fimExpediente.setUTCHours(horaFim, minutoFim, 0, 0); // Alterado para `setHours`

        let horarioAtual = new Date(inicioExpediente);

        console.log("Inicio expediente:", inicioExpediente);
        console.log("Fim expediente:", fimExpediente);

        while (horarioAtual < fimExpediente) {
            let horarioDisponivel = true;

            for (let agendamento of listaHorariosAgendados) {
                let inicioAgendamento = new Date(agendamento.horario_inicio);
                let fimAgendamento = new Date(agendamento.horario_fim);

                inicioAgendamento.setUTCHours(inicioAgendamento.getHours(), inicioAgendamento.getMinutes(), 0, 0);
                fimAgendamento.setUTCHours(fimAgendamento.getHours(), fimAgendamento.getMinutes(), 0, 0);

                if (horarioDentroIntervalo(horarioAtual, inicioAgendamento, fimAgendamento)) {
                    horarioDisponivel = false;
                    break;
                }
            }

            if (horarioDisponivel) {
                horariosDisponiveis.push(new Date(horarioAtual));
            }

            horarioAtual.setMinutes(horarioAtual.getMinutes() + 30);
        }
    }

    console.log("Horários disponíveis:", horariosDisponiveis);
    return horariosDisponiveis;
};

// Função para obter horários disponíveis
const horarios = (dataInicial, listaHorarios, listaHorariosAgendados) => {
    let horariosDisponiveis = [];
    let dataAtual = new Date(dataInicial);
    dataAtual.setHours(0, 0, 0, 0); // Normaliza para início do dia

    while (horariosDisponiveis.length === 0) {
        const diaSemanaAtual = dataAtual.getDay();

        // Filtrar apenas dias de trabalho a partir do dia atual na semana
        let diasTrabalhando = listaHorarios.filter(horario => horario.dia_semana >= diaSemanaAtual);

        for (let dia of diasTrabalhando) {
            let dataConsulta = adicionarDias(dataAtual, dia.dia_semana - diaSemanaAtual);
            dataConsulta.setHours(0, 0, 0, 0);

            // Converte os horários do banco (string) para números
            let [horaInicio, minutoInicio] = dia.horario_inicio.split(":").map(Number);
            let [horaFim, minutoFim] = dia.horario_fim.split(":").map(Number);

            let inicioExpediente = new Date(dataConsulta);
            inicioExpediente.setHours(horaInicio-3, minutoInicio, 0, 0);

            let fimExpediente = new Date(dataConsulta);
            fimExpediente.setHours(horaFim-3, minutoFim, 0, 0);

            let horarioAtual = new Date(inicioExpediente);

            while (horarioAtual < fimExpediente) {
                let horarioDisponivel = true;

                for (let agendamento of listaHorariosAgendados) {
                    let inicioAgendamento = new Date(agendamento.horario_inicio);
                    let fimAgendamento = new Date(agendamento.horario_fim);
                    inicioAgendamento.setHours(inicioAgendamento.getHours() - 3, inicioAgendamento.getMinutes(), 0, 0);
                    fimAgendamento.setHours(fimAgendamento.getHours() - 3, fimAgendamento.getMinutes(), 0, 0);

                    if (horarioDentroIntervalo(horarioAtual, inicioAgendamento, fimAgendamento)) {
                        console.log(horarioAtual, inicioAgendamento, fimAgendamento);
                        console.log("Horário indisponível");
                        horarioDisponivel = false;
                        break;
                    }
                }

                if (horarioDisponivel) {
                    horariosDisponiveis.push(new Date(horarioAtual));
                }

                horarioAtual.setMinutes(horarioAtual.getMinutes() + 30);
            }
        }

        // Se não encontrou horários livres, avança para a próxima segunda-feira
        if (horariosDisponiveis.length === 0) {
            dataAtual = adicionarDias(dataAtual, 7 - diaSemanaAtual);
        }
    }

    return horariosDisponiveis;
};

export {horarios,horarioDia};
