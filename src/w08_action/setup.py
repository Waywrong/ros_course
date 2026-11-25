from setuptools import setup

package_name = 'w08_action'

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
    description='W08 action',
    license='MIT',
    entry_points={
        'console_scripts': [
            'fibonacci_server = w08_action.fibonacci_server:main',
            'fibonacci_client = w08_action.fibonacci_client:main',
        ],
    },
)
