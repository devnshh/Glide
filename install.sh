#!/bin/bash
if ! command -v node &> /dev/null; then
    if command -v brew &> /dev/null; then
        brew install node
    fi
fi

PYTHON_CMD="python3"
if command -v python3.11 &> /dev/null; then
  PYTHON_CMD="python3.11"
elif command -v python3.10 &> /dev/null; then
  PYTHON_CMD="python3.10"
fi

cd engine
$PYTHON_CMD -m venv Glide
source Glide/bin/activate
pip install -r requirements.txt
cd ..
npm install
