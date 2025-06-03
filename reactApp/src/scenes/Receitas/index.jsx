import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { 
  useGetReceitasQuery, 
  useCreateReceitaMutation,
  useDeleteReceitaMutation
} from "state/api";

const Receitas = () => {
  // Estados para leitura de receita (não usado para o gráfico)
  const [readRecipeName, setReadRecipeName] = useState("");
  const [fetchedRecipe, setFetchedRecipe] = useState(null);

  // Estados para criação de receita
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newFunilA, setNewFunilA] = useState("");
  const [newFunilB, setNewFunilB] = useState("");
  const [newFunilC, setNewFunilC] = useState("");
  const [newFunilD, setNewFunilD] = useState("");
  const [newIngredienteA, setNewIngredienteA] = useState("");
  const [newIngredienteB, setNewIngredienteB] = useState("");
  const [newIngredienteC, setNewIngredienteC] = useState("");
  const [newIngredienteD, setNewIngredienteD] = useState("");
  // Estados para gramatura (tipo "text" para permitir vírgula)
  const [newGramaturaA, setNewGramaturaA] = useState("");
  const [newGramaturaB, setNewGramaturaB] = useState("");
  const [newGramaturaC, setNewGramaturaC] = useState("");
  const [newGramaturaD, setNewGramaturaD] = useState("");

  // Estado para deleção via input
  const [deleteRecipeId, setDeleteRecipeId] = useState("");

  // Estado para seleção no DataGrid
  const [selectionModel, setSelectionModel] = useState([]);

  // Estado que armazena a receita aplicada (para o gráfico)
  const [appliedRecipe, setAppliedRecipe] = useState(null);

  const { data: receitas, refetch } = useGetReceitasQuery();
  const [createReceita, { isLoading: isCreating }] = useCreateReceitaMutation();
  const [deleteReceita, { isLoading: isDeleting }] = useDeleteReceitaMutation();

  // Função para buscar receita pelo nome (continua disponível, se necessário)
  const handleReadRecipe = () => {
    if (receitas) {
      const recipe = receitas.find((r) => r.nome_receita === readRecipeName);
      if (recipe) {
        setFetchedRecipe(recipe);
      } else {
        alert("Receita não encontrada!");
        setFetchedRecipe(null);
      }
    }
  };

  // Função placeholder (não usada para o gráfico)
  const handleAplicaReceita = () => {
    alert("Função 'Aplica Receita' acionada");
  };

  // Função para aplicar a receita selecionada no DataGrid (apenas uma receita por vez)
  const handleAplicaReceitaSelecionada = () => {
    if (selectionModel.length === 0) {
      alert("Selecione uma receita para aplicar.");
      return;
    }
    if (selectionModel.length > 1) {
      alert("Selecione apenas uma receita para aplicar.");
      return;
    }
    const selectedId = selectionModel[0];
    const selectedRecipe = receitas.find((r) => r.id === selectedId);
    if (!selectedRecipe) {
      alert("Receita selecionada não encontrada.");
      return;
    }
    setAppliedRecipe(selectedRecipe);
    alert(`Aplicando a receita: ${selectedRecipe.nome_receita}`);
  };

  // Função para criar nova receita com validação
  const handleCreateReceita = async () => {
    const a = parseInt(newFunilA, 10);
    const b = parseInt(newFunilB, 10);
    const c = parseInt(newFunilC, 10);
    const d = parseInt(newFunilD, 10);

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
      alert("Todos os campos de percentual devem ser preenchidos com números.");
      return;
    }
    if (a + b + c + d !== 100) {
      alert("A soma dos percentuais deve ser igual a 100.");
      return;
    }

    // Converte os valores de gramatura substituindo vírgula por ponto
    const parseGramatura = (value) => parseFloat(value.replace(",", "."));
    const ga = parseGramatura(newGramaturaA);
    const gb = parseGramatura(newGramaturaB);
    const gc = parseGramatura(newGramaturaC);
    const gd = parseGramatura(newGramaturaD);

    if (isNaN(ga) || isNaN(gb) || isNaN(gc) || isNaN(gd)) {
      alert("Todos os campos de gramatura devem ser preenchidos com números válidos.");
      return;
    }

    try {
      const novaReceita = {
        nome_receita: newRecipeName,
        funilA: String(a),
        funilB: String(b),
        funilC: String(c),
        funilD: String(d),
        ingredienteA: newIngredienteA,
        ingredienteB: newIngredienteB,
        ingredienteC: newIngredienteC,
        ingredienteD: newIngredienteD,
        percentualA: a,
        percentualB: b,
        percentualC: c,
        percentualD: d,
        gramaturaA: ga,
        gramaturaB: gb,
        gramaturaC: gc,
        gramaturaD: gd,
      };
      await createReceita(novaReceita).unwrap();
      alert("Receita criada com sucesso!");
      // Limpar os campos
      setNewRecipeName("");
      setNewFunilA("");
      setNewFunilB("");
      setNewFunilC("");
      setNewFunilD("");
      setNewIngredienteA("");
      setNewIngredienteB("");
      setNewIngredienteC("");
      setNewIngredienteD("");
      setNewGramaturaA("");
      setNewGramaturaB("");
      setNewGramaturaC("");
      setNewGramaturaD("");
      refetch();
    } catch (err) {
      console.error("Erro ao criar receita:", err);
      alert("Erro ao criar receita");
    }
  };

  // Função para deletar receita pelo nome
  const handleDeleteReceita = async () => {
    if (!deleteRecipeId) {
      alert("Informe o nome da receita para deletar.");
      return;
    }
    try {
      await deleteReceita(deleteRecipeId).unwrap();
      alert("Receita deletada com sucesso!");
      setDeleteRecipeId("");
      refetch();
    } catch (err) {
      console.error("Erro ao deletar receita:", err);
      alert("Erro ao deletar receita");
    }
  };

  // Função para deletar receitas selecionadas via DataGrid
  const handleDeleteSelected = async () => {
    if (!selectionModel.length) {
      alert("Nenhuma receita selecionada.");
      return;
    }
    try {
      await Promise.all(
        selectionModel.map(async (id) => {
          const receita = receitas.find((r) => r.id === id);
          if (receita) {
            return deleteReceita(receita.nome_receita).unwrap();
          }
          return null;
        })
      );
      alert("Receitas selecionadas foram deletadas com sucesso!");
      setSelectionModel([]);
      refetch();
    } catch (err) {
      console.error("Erro ao deletar receitas selecionadas:", err);
      alert("Erro ao deletar receitas selecionadas");
    }
  };

  // Definição das colunas para a DataGrid com dados agrupados por compartimento
  // Cada coluna recebe uma classe para aplicar cores diferentes
  const columns = [
    {
      field: "nome_receita",
      headerName: "Receita",
      flex: 1,
      minWidth: 100,
      getCellClassName: () => "columnReceita",
    },
    {
      field: "compartimentoA",
      headerName: "A",
      flex: 1,
      minWidth: 100,
      getCellClassName: () => "columnA",
      renderCell: (params) => {
        const row = params.row;
        return `${row.ingredienteA || ""} - ${row.percentualA || ""}% - ${
          row.gramaturaA
            ? Number(row.gramaturaA).toFixed(3).replace(".", ",")
            : ""
        }`;
      },
    },
    {
      field: "compartimentoB",
      headerName: "B",
      flex: 1,
      minWidth: 100,
      getCellClassName: () => "columnB",
      renderCell: (params) => {
        const row = params.row;
        return `${row.ingredienteB || ""} - ${row.percentualB || ""}% - ${
          row.gramaturaB
            ? Number(row.gramaturaB).toFixed(3).replace(".", ",")
            : ""
        }`;
      },
    },
    {
      field: "compartimentoC",
      headerName: "C",
      flex: 1,
      minWidth: 100,
      getCellClassName: () => "columnC",
      renderCell: (params) => {
        const row = params.row;
        return `${row.ingredienteC || ""} - ${row.percentualC || ""}% - ${
          row.gramaturaC
            ? Number(row.gramaturaC).toFixed(3).replace(".", ",")
            : ""
        }`;
      },
    },
    {
      field: "compartimentoD",
      headerName: "D",
      flex: 1,
      minWidth: 100,
      getCellClassName: () => "columnD",
      renderCell: (params) => {
        const row = params.row;
        return `${row.ingredienteD || ""} - ${row.percentualD || ""}% - ${
          row.gramaturaD
            ? Number(row.gramaturaD).toFixed(3).replace(".", ",")
            : ""
        }`;
      },
    },
  ];

  // Gerar os dados do gráfico com base na receita aplicada
  const chartData = appliedRecipe
    ? [
        { label: `A: ${appliedRecipe.ingredienteA}`, value: appliedRecipe.percentualA },
        { label: `B: ${appliedRecipe.ingredienteB}`, value: appliedRecipe.percentualB },
        { label: `C: ${appliedRecipe.ingredienteC}`, value: appliedRecipe.percentualC },
        { label: `D: ${appliedRecipe.ingredienteD}`, value: appliedRecipe.percentualD },
      ]
    : [];

  return (
    <Box m="0.5rem">
      <Box mb="1rem" />
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="1rem">
        {/* Área de Criação de Receita */}
        <Box gridColumn="span 6" p="1rem" border="1px solid gray" borderRadius="0.55rem">
          <Typography variant="h6" mb={1}>
            Crie sua Receita
          </Typography>
          <TextField
            label="Nome da Receita para Guardar"
            value={newRecipeName}
            onChange={(e) => setNewRecipeName(e.target.value)}
            variant="filled"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
            {/* Compartimento A */}
            <TextField
              label="Material A"
              value={newIngredienteA}
              onChange={(e) => setNewIngredienteA(e.target.value)}
              variant="filled"
              fullWidth
            />
            <TextField
              label="Percentual A"
              type="number"
              value={newFunilA}
              onChange={(e) => setNewFunilA(e.target.value)}
              variant="filled"
            />
            <TextField
              label="Gramatura A"
              type="text"
              value={newGramaturaA}
              onChange={(e) => setNewGramaturaA(e.target.value)}
              variant="filled"
            />
            {/* Compartimento B */}
            <TextField
              label="Material B"
              value={newIngredienteB}
              onChange={(e) => setNewIngredienteB(e.target.value)}
              variant="filled"
              fullWidth
            />
            <TextField
              label="Percentual B"
              type="number"
              value={newFunilB}
              onChange={(e) => setNewFunilB(e.target.value)}
              variant="filled"
            />
            <TextField
              label="Gramatura B"
              type="text"
              value={newGramaturaB}
              onChange={(e) => setNewGramaturaB(e.target.value)}
              variant="filled"
            />
            {/* Compartimento C */}
            <TextField
              label="Material C"
              value={newIngredienteC}
              onChange={(e) => setNewIngredienteC(e.target.value)}
              variant="filled"
              fullWidth
            />
            <TextField
              label="Percentual C"
              type="number"
              value={newFunilC}
              onChange={(e) => setNewFunilC(e.target.value)}
              variant="filled"
            />
            <TextField
              label="Gramatura C"
              type="text"
              value={newGramaturaC}
              onChange={(e) => setNewGramaturaC(e.target.value)}
              variant="filled"
            />
            {/* Compartimento D */}
            <TextField
              label="Material D"
              value={newIngredienteD}
              onChange={(e) => setNewIngredienteD(e.target.value)}
              variant="filled"
              fullWidth
            />
            <TextField
              label="Percentual D"
              type="number"
              value={newFunilD}
              onChange={(e) => setNewFunilD(e.target.value)}
              variant="filled"
            />
            <TextField
              label="Gramatura D"
              type="text"
              value={newGramaturaD}
              onChange={(e) => setNewGramaturaD(e.target.value)}
              variant="filled"
            />
          </Box>
          <Box mt={2}>
            <Button variant="contained" onClick={handleCreateReceita} disabled={isCreating}>
              {isCreating ? "Criando..." : "Salva Receita"}
            </Button>
          </Box>
        </Box>

        {/* Área do Gráfico (Receita Atual) */}
        <Box gridColumn="span 6" p="1rem" border="1px solid gray" borderRadius="0.55rem">
          <Typography variant="h6" mb={2}>
            Receita Atual
          </Typography>
          {appliedRecipe ? (
            <PieChart
              series={[
                {
                  data: chartData,
                  arcLabel: (item) => `${item.value}%`,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: "60%",
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: "bold",
                },
              }}
              width={400}
              height={200}
            />
          ) : (
            <Typography variant="body2">Nenhuma receita aplicada</Typography>
          )}
        </Box>

        {/* Listagem de Receitas via DataGrid reorientada */}
        <Box gridColumn="span 12" p="1rem" border="1px solid gray" borderRadius="0.55rem">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Receitas Salvas</Typography>
            <Box display="flex" gap={1}>
              <Button variant="contained" color="error" onClick={handleDeleteSelected}>
                Deletar Receitas Selecionadas
              </Button>
              <Button variant="contained" color="primary" onClick={handleAplicaReceitaSelecionada}>
                Aplicar Receita Selecionada
              </Button>
            </Box>
          </Box>
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={receitas || []}
              columns={columns}
              checkboxSelection
              onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
              selectionModel={selectionModel}
              pageSizeOptions={[5, 10]}
              initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
              density="compact"
              sx={{
                border: 0,
                "& .MuiDataGrid-cell": {
                  py: 0,
                  px: 0.5,
                  fontSize: "0.875rem",
                },
                "& .MuiDataGrid-columnHeaders": {
                  py: 0,
                  px: 0.5,
                  fontSize: "0.875rem",
                },
                // Estilos personalizados para cada coluna
                "& .columnReceita": { backgroundColor: "#f9f9f9" },
                "& .columnA": { backgroundColor: "#f1f1f1" },
                "& .columnB": { backgroundColor: "#f9f9f9" },
                "& .columnC": { backgroundColor: "#f1f1f1" },
                "& .columnD": { backgroundColor: "#f9f9f9" },
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Receitas;
