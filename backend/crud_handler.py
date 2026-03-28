import json
import boto3
import uuid
from datetime import datetime
from boto3.dynamodb.conditions import Key

#Iniciar DynamoDB e pegar as credenciais da AWS
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('yolo-pessoas')

#Formatar a resposta para a API
def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }

#Entrada Lambda
def lambda_handler(event, context):
    http_method = event.get('httpMethod')
    
    try:
        if http_method == 'POST':
            return create_pessoa(event)
        elif http_method == 'GET':
            return get_pessoas(event)
        elif http_method == 'PUT':
            return update_pessoa(event)
        elif http_method == 'DELETE':
            return delete_pessoa(event)
        else:
            return build_response(400, {'message': 'Método HTTP'})
            
    except Exception as e:
        print(f"Erro no servidor: {str(e)}")
        return build_response(500, {'error': 'Erro no servidor.'})

#Criar novo registro no DynamoDB
def create_pessoa(event):
    body = json.loads(event.get('body', '{}'))
    
    #Validação 
    required_fields = ['nome', 'telefone', 'email', 'tipo']
    if not all(field in body for field in required_fields):
        return build_response(400, {'message': 'Faltam campos obrigatórios.'})
        
    #Gerar ID único e definir a data de cadastro 
    item_id = str(uuid.uuid4())
    data_cadastro = body.get('data_cadastro', datetime.now().strftime('%Y-%m-%d'))
    
    novo_item = {
        'id': item_id,
        'nome': body['nome'],
        'telefone': body['telefone'],
        'email': body['email'],
        'tipo': body['tipo'],
        'data_cadastro': data_cadastro
    }
    
    table.put_item(Item=novo_item)
    return build_response(201, {'message': 'Pessoa cadastrada com sucesso!', 'item': novo_item})

#Busca pessoas
def get_pessoas(event):
    query_params = event.get('queryStringParameters') or {}
    
    if 'tipo' in query_params:
        #Filtrar por tipo
        tipo_buscado = query_params['tipo']
        response = table.query(
            IndexName='TipoIndex',
            KeyConditionExpression=Key('tipo').eq(tipo_buscado)
        )
        items = response.get('Items', [])
    else:
        #Retorna todos os registros
        response = table.scan()
        items = response.get('Items', [])
        
    return build_response(200, items)

#Atualiza os dados de uma pessoa existente pelo ID
def update_pessoa(event):
    body = json.loads(event.get('body', '{}'))
    item_id = body.get('id')
    
    if not item_id:
        return build_response(400, {'message': 'O ID é obrigatório para atualização.'})
        
    #Exemplo simples
    response = table.update_item(
        Key={'id': item_id},
        UpdateExpression="set telefone=:t, email=:e",
        ExpressionAttributeValues={
            ':t': body.get('telefone'),
            ':e': body.get('email')
        },
        ReturnValues="UPDATED_NEW"
    )
    return build_response(200, {'message': 'Atualizado com sucesso', 'updated': response.get('Attributes')})

#Remove uma pessoa da tabela pelo ID.
def delete_pessoa(event):
    body = json.loads(event.get('body', '{}'))
    item_id = body.get('id')
    
    if not item_id:
        return build_response(400, {'message': 'O ID é obrigatório para exclusão.'})
        
    table.delete_item(Key={'id': item_id})
    return build_response(200, {'message': f'Registro {item_id} deletado com sucesso.'})