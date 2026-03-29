import json
import boto3
import uuid
from datetime import datetime
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('yolo-pessoas')

def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        },
        'body': json.dumps(body)
    }

def lambda_handler(event, context):
    http_method = event.get('httpMethod')
    
    try:
        if http_method == 'OPTIONS':
            return build_response(200, 'CORS OK')
        elif http_method == 'POST':
            return create_pessoa(event)
        elif http_method == 'GET':
            return get_pessoas(event)
        elif http_method == 'PUT':
            return update_pessoa(event)
        elif http_method == 'DELETE':
            return delete_pessoa(event)
        else:
            return build_response(400, {'message': f'Método HTTP não suportado: {http_method}'})
            
    except Exception as e:
        print(f"Erro no servidor: {str(e)}")
        return build_response(500, {'error': 'Erro interno no servidor.'})

def create_pessoa(event):
    body = json.loads(event.get('body', '{}'))
    
    required_fields = ['nome', 'telefone', 'email', 'tipo']
    if not all(field in body for field in required_fields):
        return build_response(400, {'message': 'Faltam campos obrigatórios.'})
        
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

def get_pessoas(event):
    query_params = event.get('queryStringParameters') or {}
    
    if 'tipo' in query_params:
        tipo_buscado = query_params['tipo']
        response = table.query(
            IndexName='TipoIndex',
            KeyConditionExpression=Key('tipo').eq(tipo_buscado)
        )
        items = response.get('Items', [])
    else:
        response = table.scan()
        items = response.get('Items', [])
        
    return build_response(200, items)

def update_pessoa(event):
    body = json.loads(event.get('body', '{}'))
    item_id = body.get('id')
    
    if not item_id:
        return build_response(400, {'message': 'O ID é obrigatório para atualização.'})
        
    response = table.update_item(
        Key={'id': item_id},
        UpdateExpression="set nome=:n, telefone=:t, email=:e, tipo=:tp",
        ExpressionAttributeValues={
            ':n': body.get('nome'),
            ':t': body.get('telefone'),
            ':e': body.get('email'),
            ':tp': body.get('tipo')
        },
        ReturnValues="UPDATED_NEW"
    )
    return build_response(200, {'message': 'Atualizado com sucesso', 'updated': response.get('Attributes')})

def delete_pessoa(event):
    body = json.loads(event.get('body', '{}'))
    item_id = body.get('id')
    
    if not item_id:
        return build_response(400, {'message': 'O ID é obrigatório para exclusão.'})
        
    table.delete_item(Key={'id': item_id})
    return build_response(200, {'message': f'Registro {item_id} deletado com sucesso.'})