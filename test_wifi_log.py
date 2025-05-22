import socket

HOST = '0.0.0.0'
PORT = 5001

print("[SYSTEME] Attente de connexion sur le port 5001...")

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen(1)
    conn, addr = s.accept()
    print(f"[CONNEXION] Client connecté depuis {addr}")

    with conn:
        buffer = ""
        while True:
            data = conn.recv(1024)
            if not data:
                print("[INFO] Connexion fermée.")
                break
            buffer += data.decode(errors="ignore")
            lines = buffer.split("\n")
            buffer = lines[-1]
            for line in lines[:-1]:
                print(f"[RECU] {line.strip()}")
