import requests
import boto3
import uuid
import json 

dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
table = dynamodb.Table('yolo-pessoas')

API_URL = "https://3ji5haxzr9.execute-api.us-east-1.amazonaws.com/dev/caseYolo"

def importar_dados():
    print(f"Buscando dados na API: {API_URL}...")
    
    try:
        response = requests.get(API_URL)
        response.raise_for_status() 
        
        dados = response.json()
        
        if 'body' in dados:
            corpo_da_resposta = json.loads(dados['body'])
            clientes = corpo_da_resposta.get('clientes', [])
        else:
            clientes = dados.get('clientes', [])
            
        print(f"Encontrados {len(clientes)} clientes. Iniciando importação...")
        
        for cliente in clientes:
            item_id = str(uuid.uuid4())
            novo_item = {
                'id': item_id,
                'nome': cliente.get('Nome', ''),
                'telefone': cliente.get('Telefone', ''),
                'email': cliente.get('E-mail', ''),
                'tipo': cliente.get('Tipo', ''),
                'data_cadastro': cliente.get('Data de Cadastro', '')
            }
            
            table.put_item(Item=novo_item)
            print(f"[OK] Importado: {novo_item['nome']} ({novo_item['tipo']})")
            
        print("\nImportação concluída com sucesso!")
        
    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar a API: {e}")
    except json.JSONDecodeError:
        print("Erro: Não foi possível decodificar o JSON do body.")
    except Exception as e:
        print(f"Erro inesperado: {e}")

if __name__ == "__main__":
    importar_dados()