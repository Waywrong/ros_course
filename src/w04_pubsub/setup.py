from setuptools import setup

package_name = 'w04_pubsub'

setup(
    name=package_name,
    version='0.1.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages', ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='course',
    maintainer_email='noreply@example.com',
    description='W04 第一個 publisher / subscriber（Python）',
    license='MIT',
    entry_points={
        'console_scripts': [
            'talker = w04_pubsub.talker:main',
            'listener = w04_pubsub.listener:main',
        ],
    },
)
