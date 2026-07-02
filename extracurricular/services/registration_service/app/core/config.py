from dotenv import load_dotenv
import os

load_dotenv()

BOOTCAMP_SERVICE_URL = os.getenv("BOOTCAMP_SERVICE_URL", "http://bootcamp_service:8000")
