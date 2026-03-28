import requests
import boto3
import uuid

# Configuração do DynamoDB
# Lembre-se de configurar suas credenciais AWS localmente (aws configure)
dynamodb = boto3.resource('dynamodb', region_name='us-east-1') 
table = dynamodb.Table('yolo-pessoas')

API_URL = "https://3ji5haxzr9.execute-api.us-east-1.amazonaws.com/dev/caseYolo"

def importar_dados():
    print(f"Buscando dados na API: {API_URL}")
    
    try:
        #Requisição GET na API
        response = requests.get(API_URL)
        response.raise_for_status()
        
        dados = response.json()
        
        #API retorna objeto chave clientes com a lista
        clientes = dados.get('clientes', [])
        print(f"Encontrados {len(clientes)} clientes. Iniciando importação")
        
        for cliente in clientes:
            #Mapear chaves do JSON da API para o padrão do banco
            item_id = str(uuid.uuid4())
            novo_item = {
                'id': item_id,
                'nome': cliente.get('Nome', ''),
                'telefone': cliente.get('Telefone', ''),
                'email': cliente.get('E-mail', ''),
                'tipo': cliente.get('Tipo', ''),
                'data_cadastro': cliente.get('Data de Cadastro', '')
            }
            
            #Insere no DynamoDB
            table.put_item(Item=novo_item)
            print(f"OK Importado: {novo_item['nome']} ({novo_item['tipo']})")
            
        print("\nImportação concluída com sucesso!")
        
    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar a API: {e}")
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    importar_dados()