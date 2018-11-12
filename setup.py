from setuptools import setup, find_packages

setup(
        name='orthographies',
        author='Johann-Mattis List',
        url='https://github.com/lingpy/lingrex',
        classifiers=[
            'Development Status :: 4 - Beta',
            'Intended Audience :: Science/Research',
            'Operating System :: OS Independent',
            'Programming Language :: Python :: 3',
            'Programming Language :: Python :: 3.5',
            'Programming Language :: Python :: 3.6',
        ],
        version='0.1.0',
        packages=find_packages(where='src'),
        package_dir={'': 'src'},
        install_requires=['segments'],
        )
